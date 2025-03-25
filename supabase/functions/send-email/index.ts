
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { to, subject, body, from, fromName } = await req.json();
    
    console.log(`Email sending request received to: ${to}`);
    
    // Get user's email configuration from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      throw new Error("Missing Supabase environment variables");
    }
    
    // Get JWT from request for authenticated requests
    const authHeader = req.headers.get('Authorization');
    let userId;
    
    if (authHeader) {
      // Extract and verify the JWT token
      try {
        const token = authHeader.replace('Bearer ', '');
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: supabaseKey
          }
        });
        
        if (!response.ok) {
          console.error("Failed to verify user token:", response.status, await response.text());
          throw new Error("Failed to verify user token");
        }
        
        const userData = await response.json();
        userId = userData.id;
        console.log("Authenticated user ID:", userId);
      } catch (authError) {
        console.error("Authentication error:", authError);
        throw new Error("Authentication failed: " + authError.message);
      }
    }
    
    if (!userId) {
      console.error("No user ID found in the request");
      throw new Error("Authentication required to send email");
    }
    
    // Get user's email config from database
    console.log("Fetching email config for user:", userId);
    const configResponse = await fetch(
      `${supabaseUrl}/rest/v1/smtp_configs?user_id=eq.${userId}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!configResponse.ok) {
      console.error("Failed to fetch email config:", configResponse.status, await configResponse.text());
      throw new Error(`Failed to fetch email configuration: ${configResponse.status}`);
    }
    
    const configs = await configResponse.json();
    
    if (!configs || configs.length === 0) {
      console.error("No email configuration found for user");
      throw new Error("No email configuration found for user");
    }
    
    const config = configs[0];
    console.log("Found email config:", { 
      ...config, 
      password: config.password ? "REDACTED" : null, 
      client_secret: config.client_secret ? "REDACTED" : null,
      refresh_token: config.refresh_token ? "REDACTED" : null,
      access_token: config.access_token ? "REDACTED" : null 
    });
    
    // Check if using Gmail API or regular SMTP
    if (config.auth_method === "oauth2" && config.host.includes("gmail")) {
      console.log("Using Gmail API for sending email");
      
      // Validate required OAuth2 credentials
      if (!config.client_id) {
        throw new Error("Missing client_id for Gmail OAuth2");
      }
      
      if (!config.client_secret) {
        throw new Error("Missing client_secret for Gmail OAuth2");
      }
      
      if (!config.refresh_token) {
        throw new Error("Missing refresh_token for Gmail OAuth2");
      }
      
      // Always refresh the token for Gmail API to ensure we have a valid one
      console.log("Getting fresh access token using refresh token");
      let accessToken;
      
      try {
        console.log("Making request to refresh token with client_id and refresh_token...");
        
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: config.client_id,
            client_secret: config.client_secret,
            refresh_token: config.refresh_token,
            grant_type: 'refresh_token'
          })
        });
        
        const responseStatus = tokenResponse.status;
        const responseText = await tokenResponse.text();
        console.log("Token refresh response:", responseStatus, responseText);
        
        if (!tokenResponse.ok) {
          let responseJson;
          try {
            responseJson = JSON.parse(responseText);
          } catch (e) {
            responseJson = null;
          }

          // More detailed error messaging based on the response
          if (responseStatus === 401) {
            throw new Error("Invalid OAuth2 credentials. Please check your OAuth configuration and regenerate refresh tokens.");
          } else if (responseStatus === 400) {
            if (responseJson && responseJson.error === "invalid_grant") {
              throw new Error("Your OAuth refresh token has expired or been revoked. Please reconfigure Gmail OAuth.");
            } else {
              throw new Error(`OAuth error: ${responseJson ? responseJson.error_description || responseJson.error : responseText}`);
            }
          } else {
            throw new Error(`Failed to refresh access token: ${responseStatus} - ${responseText}`);
          }
        }
        
        let tokenData;
        try {
          tokenData = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse token response:", e);
          throw new Error("Invalid token response format");
        }
        
        if (tokenData.error) {
          console.error("Error refreshing token:", tokenData);
          throw new Error(`Failed to refresh access token: ${tokenData.error}`);
        }
        
        accessToken = tokenData.access_token;
        console.log("Access token refreshed successfully");
        
        // Update the access token in the database
        const updateResponse = await fetch(
          `${supabaseUrl}/rest/v1/smtp_configs?id=eq.${config.id}`,
          {
            method: 'PATCH',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              access_token: accessToken,
              updated_at: new Date().toISOString()
            })
          }
        );
        
        if (!updateResponse.ok) {
          console.error("Failed to update access token in database:", updateResponse.status);
          // Continue anyway since we have a valid token for this request
        } else {
          console.log("Access token updated in database");
        }
      } catch (tokenError) {
        console.error("Error during token refresh:", tokenError);
        throw new Error("Failed to refresh access token: " + tokenError.message);
      }
      
      if (!accessToken) {
        console.error("Failed to obtain access token");
        throw new Error("Could not obtain access token for Gmail API");
      }
      
      // Create the email as a base64url encoded string
      const emailContent = [
        `From: ${fromName ? `${fromName} <${from}>` : from}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        body
      ].join('\r\n');
      
      // Convert the email to base64url encoding
      const encoder = new TextEncoder();
      const emailBytes = encoder.encode(emailContent);
      const base64Email = btoa(String.fromCharCode(...emailBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      console.log("Sending email via Gmail API");
      
      // Send the email using Gmail API
      try {
        const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: base64Email
          })
        });
        
        const responseStatus = gmailResponse.status;
        let responseText = await gmailResponse.text();
        console.log("Gmail API response:", responseStatus, responseText);
        
        if (!gmailResponse.ok) {
          let responseJson;
          try {
            responseJson = JSON.parse(responseText);
          } catch (e) {
            responseJson = null;
          }
          
          if (responseStatus === 401) {
            throw new Error("Gmail API authorization failed. Your Gmail OAuth setup may need to be reconfigured.");
          } else if (responseStatus === 403) {
            if (responseJson && responseJson.error && responseJson.error.message) {
              throw new Error(`Gmail API error: ${responseJson.error.message}`);
            } else {
              throw new Error("Gmail API permission denied. Make sure your OAuth scope includes https://mail.google.com/");
            }
          } else if (responseStatus === 400) {
            if (responseJson && responseJson.error && responseJson.error.message) {
              throw new Error(`Gmail API error: ${responseJson.error.message}`);
            } else {
              throw new Error(`Gmail API error: ${responseText}`);
            }
          } else {
            throw new Error(`Gmail API error: HTTP ${responseStatus} - ${responseText}`);
          }
        }
        
        let gmailData;
        try {
          gmailData = JSON.parse(responseText);
        } catch (jsonError) {
          console.log("Non-JSON response from Gmail API", responseText);
          gmailData = { success: true };
        }
        
        if (gmailData.error) {
          console.error("Gmail API error:", gmailData);
          throw new Error(`Gmail API error: ${gmailData.error.message || JSON.stringify(gmailData.error)}`);
        }
        
        console.log("Email sent successfully via Gmail API:", gmailData);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Email sent successfully via Gmail API",
            id: gmailData.id || "message-sent"
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (gmailError) {
        console.error("Error sending via Gmail API:", gmailError);
        throw new Error("Failed to send email via Gmail API: " + gmailError.message);
      }
    } else {
      // We would implement regular SMTP sending here, but for now return a message
      // that we're not implementing direct SMTP due to serverless limitations
      console.log("SMTP direct connection not supported in serverless environment");
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Direct SMTP connections are not supported in serverless environments. Please use Gmail API (OAuth2) or another email service API like SendGrid.",
          usingSmtp: true
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Email sending error:", error);
    
    // Determine if this is an OAuth error that needs special handling
    const errorMessage = error.message || "Unknown error";
    let userFriendlyMessage = `Failed to send email: ${errorMessage}`;
    
    if (
      errorMessage.includes("OAuth") || 
      errorMessage.includes("token") || 
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      userFriendlyMessage = 
        "Gmail OAuth authentication failed. Please reconfigure your Gmail OAuth setup in Email Settings. " +
        "This usually happens when refresh tokens expire or permissions change. " + 
        "Make sure your OAuth scope includes https://mail.google.com/";
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: userFriendlyMessage,
        technicalDetails: errorMessage,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
