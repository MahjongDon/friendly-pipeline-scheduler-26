
import { supabase } from "@/integrations/supabase/client";

export const validateEmailConfig = (config: {
  host: string;
  port: string;
  username: string;
  password?: string;
  fromEmail: string;
  fromName?: string;
  authMethod: "plain" | "oauth2";
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}) => {
  const errors: string[] = [];
  
  // Host validation
  if (!config.host) {
    errors.push("SMTP host is required");
  }
  
  // Port validation
  const port = parseInt(config.port);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push("Port must be a valid number between 1 and 65535");
  }
  
  // Username/email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!config.username) {
    errors.push("Username is required");
  } else if (!emailRegex.test(config.username)) {
    errors.push("Username must be a valid email address");
  }
  
  // Auth method specific validation
  if (config.authMethod === "plain") {
    // Password validation for plain auth
    if (!config.password) {
      errors.push("Password is required for plain authentication");
    } else if (config.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
  } else if (config.authMethod === "oauth2") {
    // OAuth2 validation
    if (!config.clientId) {
      errors.push("Client ID is required for OAuth2 authentication");
    }
    
    if (!config.clientSecret) {
      errors.push("Client Secret is required for OAuth2 authentication");
    }
    
    if (!config.refreshToken) {
      errors.push("Refresh Token is required for OAuth2 authentication");
    }
  }
  
  // From email validation
  if (!config.fromEmail) {
    errors.push("From Email is required");
  } else if (!emailRegex.test(config.fromEmail)) {
    errors.push("From Email must be a valid email address");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const testEmailConfig = async (config: {
  host: string;
  port: string;
  username: string;
  password?: string;
  fromEmail: string;
  fromName?: string;
  authMethod: "plain" | "oauth2";
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}) => {
  try {
    console.log("Testing email configuration:", {
      ...config, 
      password: config.password ? "********" : undefined,
      clientSecret: config.clientSecret ? "********" : undefined,
      refreshToken: config.refreshToken ? "********" : undefined,
      accessToken: config.accessToken ? "********" : undefined
    });
    
    // For Gmail with OAuth2, we don't need to test via SMTP
    if (config.host.includes("gmail") && config.authMethod === "oauth2") {
      return {
        success: true,
        message: "Gmail API configuration accepted. Email sending will use the Gmail API instead of SMTP.",
        usingGmailApi: true
      };
    }
    
    const { data, error } = await supabase.functions.invoke('test-smtp', {
      body: config
    });
    
    if (error) {
      console.error("Error invoking SMTP test function:", error);
      // Even on Supabase function error, try to extract any response data if available
      if (error.message && error.message.includes("Edge Function returned a non-2xx status code")) {
        return {
          success: false,
          message: "SMTP test failed: Could not connect to the SMTP server",
          diagnosticInfo: "This may be due to incorrect settings or network limitations in the cloud environment.",
          cloudLimitation: true
        };
      }
      
      return {
        success: false,
        message: error.message || "Failed to test SMTP connection",
        diagnosticInfo: "Check network connectivity and try again.",
        cloudLimitation: true
      };
    }
    
    return data || { 
      success: false, 
      message: "No response from SMTP test function", 
      diagnosticInfo: "This might be a temporary issue. Try again later.",
      cloudLimitation: true
    };
  } catch (error) {
    console.error("Exception testing SMTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test SMTP connection",
      diagnosticInfo: "Unexpected error while testing connection. Check console for details.",
      cloudLimitation: true
    };
  }
};

export const saveEmailConfig = async (config: {
  host: string;
  port: string;
  username: string;
  password?: string;
  fromEmail: string;
  fromName?: string;
  authMethod: "plain" | "oauth2";
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}) => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        message: "Authentication required to save email configuration"
      };
    }
    
    const userId = session.user.id;
    
    // First check if a config already exists
    const { data: existingConfig } = await supabase
      .from('smtp_configs')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    // Create the database entry object with typed interface
    const dbEntry = {
      host: config.host,
      port: config.port,
      username: config.username,
      auth_method: config.authMethod,
      from_email: config.fromEmail,
      from_name: config.fromName,
      user_id: userId,
      // Set conditionally based on auth method
      ...(config.authMethod === "plain" 
        ? { 
            password: config.password,
            client_id: null,
            client_secret: null,
            refresh_token: null,
            access_token: null
          } 
        : {
            password: null,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            refresh_token: config.refreshToken,
            access_token: config.accessToken
          }
      )
    } as any; // Use 'any' to bypass strict type checking
    
    if (existingConfig && existingConfig.length > 0) {
      // Update existing config
      const { data, error } = await supabase
        .from('smtp_configs')
        .update(dbEntry)
        .eq('id', existingConfig[0].id)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } else {
      // Insert new config
      const { data, error } = await supabase
        .from('smtp_configs')
        .insert(dbEntry)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error("Error saving email config:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save email configuration"
    };
  }
};

export const getEmailConfig = async () => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        message: "Authentication required to get email configuration"
      };
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('smtp_configs')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching email config:", error);
      return { success: false, message: error.message };
    }
    
    if (!data) {
      return { success: false, message: "No email configuration found" };
    }
    
    return { 
      success: true, 
      config: {
        host: data.host,
        port: data.port,
        username: data.username,
        authMethod: data.auth_method || "plain",
        password: data.password, // Will be included only if auth_method is "plain"
        clientId: data.client_id, // Will be included only if auth_method is "oauth2"
        clientSecret: data.client_secret, // Will be included only if auth_method is "oauth2"
        refreshToken: data.refresh_token, // Will be included only if auth_method is "oauth2"
        accessToken: data.access_token, // Will be included only if auth_method is "oauth2"
        fromEmail: data.from_email,
        fromName: data.from_name
      } 
    };
  } catch (error) {
    console.error("Error fetching email config:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch email configuration"
    };
  }
};

// New function to send an email using the Supabase function
export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  body: string;
  from?: string;
  fromName?: string;
}) => {
  try {
    // Get the user's email configuration
    const configResult = await getEmailConfig();
    
    if (!configResult.success) {
      return {
        success: false,
        message: "Failed to get email configuration: " + configResult.message
      };
    }
    
    const config = configResult.config;
    
    // Use the stored from email/name if not provided
    const from = emailData.from || config.fromEmail;
    const fromName = emailData.fromName || config.fromName;
    
    // Call our send-email Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        from,
        fromName
      }
    });
    
    if (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        message: error.message || "Failed to send email",
        error
      };
    }
    
    return data || { 
      success: false, 
      message: "No response from email function"
    };
  } catch (error) {
    console.error("Exception sending email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email"
    };
  }
};
