
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { host, port, username, password, fromEmail, fromName } = await req.json();
    
    console.log(`Testing SMTP connection to ${host}:${port}`);
    
    if (!host || !port || !username || !password || !fromEmail) {
      throw new Error("Missing required SMTP configuration parameters");
    }
    
    // Create SMTP client
    const client = new SmtpClient();
    
    try {
      console.log("Attempting to connect to SMTP server...");
      
      // Set connection timeout
      const timeoutMs = 20000; // 20 second timeout
      let connectPromise;
      
      // Different connection approach based on port
      const portNumber = Number(port);
      
      // Cloud environment notice
      console.log("Note: SMTP connections may be restricted in Supabase Edge Functions");
      
      // Always use TLS approach regardless of port (both 587 and 465)
      // This is a workaround for Deno compatibility issues with port 465
      console.log(`Using TLS connection for port ${portNumber}`);
      connectPromise = client.connectTLS({
        hostname: host,
        port: portNumber,
        username: username,
        password: password,
        debug: true,
      });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Connection timeout after ${timeoutMs}ms`)), timeoutMs);
      });
      
      // Race the connection against the timeout
      await Promise.race([connectPromise, timeoutPromise]);
      
      console.log("SMTP connection established successfully");

      // Prepare test email content
      const testSubject = "SMTP Configuration Test";
      const testBody = `
        <h1>SMTP Test Successful</h1>
        <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
        <p>Configuration details:</p>
        <ul>
          <li>Host: ${host}</li>
          <li>Port: ${port}</li>
          <li>Username: ${username}</li>
          <li>From Email: ${fromEmail}</li>
          <li>From Name: ${fromName || fromEmail}</li>
        </ul>
        <p>If you received this email, your SMTP configuration is working properly.</p>
      `;

      console.log("Preparing to send test email...");
      
      // Send test email with timeout
      const sendPromise = client.send({
        from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
        to: username,
        subject: testSubject,
        content: testBody,
        html: testBody,
      });
      
      // Set another timeout for sending
      const sendTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Send timeout after ${timeoutMs}ms`)), timeoutMs);
      });
      
      // Race the send operation against timeout
      const sendResult = await Promise.race([sendPromise, sendTimeoutPromise]);
      
      console.log("SMTP test email sent successfully", sendResult);

      // Close connection
      await client.close();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "SMTP connection test successful. A test email has been sent to your email address." 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (smtpError: any) {
      console.error("SMTP connection or sending error:", smtpError);
      
      let errorMessage = smtpError.message || "Unknown SMTP error";
      let diagnosticInfo = "";
      
      // Add more specific error messages for common SMTP issues
      if (typeof errorMessage === 'string') {
        if (errorMessage.includes("timeout")) {
          errorMessage = `Connection timeout. The SMTP server did not respond within the allowed time.`;
          diagnosticInfo = "This is common in serverless environments. Consider using a third-party email service API instead.";
        } else if (errorMessage.includes("authentication")) {
          errorMessage = `Authentication failed. Please check your username and password.`;
          diagnosticInfo = "For Gmail, ensure you're using an App Password if 2FA is enabled.";
        } else if (errorMessage.includes("certificate")) {
          errorMessage = `SSL/TLS certificate error.`;
          diagnosticInfo = "There was an issue with the server's security certificate.";
        } else if (errorMessage.includes("bufio") || errorMessage.includes("connection")) {
          errorMessage = `Connection error. This may be due to incorrect host/port or network issues.`;
          diagnosticInfo = "SMTP connections are often blocked in serverless environments. Consider using a third-party email service API (like SendGrid, Postmark, etc.) instead of direct SMTP.";
        } else if (errorMessage.includes("Error: failed to lookup address")) {
          errorMessage = `DNS lookup failed. Could not find the SMTP server.`;
          diagnosticInfo = "Check that the hostname is correct.";
        } else if (errorMessage.includes("Deno.writeAll is not a function")) {
          errorMessage = `SMTP library compatibility issue with port 465.`;
          diagnosticInfo = "This is a known limitation with the current Deno SMTP library. Consider using a dedicated email service API instead.";
        } else {
          // Generic message for other errors
          diagnosticInfo = "SMTP connections from serverless functions often fail due to network restrictions. Consider using a dedicated email service API instead.";
        }
      }
      
      // Ensure connection is closed even on error
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `SMTP error: ${errorMessage}`,
          diagnosticInfo: diagnosticInfo,
          cloudLimitation: true
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Return 200 even for SMTP errors so frontend can display the message
        }
      );
    }
  } catch (error: any) {
    console.error("SMTP test error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Failed to test SMTP connection: ${error.message || "Unknown error"}`,
        diagnosticInfo: "Check network connectivity and try again.",
        stack: error.stack // Include stack trace for debugging
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 even for errors so frontend can display the message
      }
    );
  }
});
