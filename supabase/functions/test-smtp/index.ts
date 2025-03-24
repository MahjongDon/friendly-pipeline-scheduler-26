
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
      // Connect to the SMTP server with TLS
      await client.connectTLS({
        hostname: host,
        port: Number(port),
        username: username,
        password: password,
      });
      
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

      // Send test email to the user's email
      const sendResult = await client.send({
        from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
        to: username,
        subject: testSubject,
        content: testBody,
        html: testBody,
      });
      
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
    } catch (smtpError) {
      console.error("SMTP connection or sending error:", smtpError.message);
      
      // Ensure connection is closed even on error
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError.message);
      }
      
      throw new Error(`SMTP error: ${smtpError.message}`);
    }
  } catch (error) {
    console.error("SMTP test error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Failed to test SMTP connection: ${error.message}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
