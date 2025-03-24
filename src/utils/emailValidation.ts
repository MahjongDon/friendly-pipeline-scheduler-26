
import { supabase } from "@/integrations/supabase/client";

export const validateEmailConfig = (config: {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName?: string;
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
  if (!emailRegex.test(config.username)) {
    errors.push("Username must be a valid email address");
  }
  
  // Password validation
  if (!config.password || config.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // From email validation
  if (!emailRegex.test(config.fromEmail)) {
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
  password: string;
  fromEmail: string;
  fromName?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('test-smtp', {
      body: config
    });
    
    if (error) {
      console.error("Error testing SMTP:", error);
      return {
        success: false,
        message: error.message || "Failed to test SMTP connection"
      };
    }
    
    return data;
  } catch (error) {
    console.error("Exception testing SMTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test SMTP connection"
    };
  }
};

export const saveEmailConfig = async (config: {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName?: string;
}) => {
  try {
    // First check if a config already exists
    const { data: existingConfig } = await supabase
      .from('smtp_configs')
      .select('id')
      .limit(1);
    
    if (existingConfig && existingConfig.length > 0) {
      // Update existing config
      const { data, error } = await supabase
        .from('smtp_configs')
        .update({
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          from_email: config.fromEmail,
          from_name: config.fromName
        })
        .eq('id', existingConfig[0].id)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } else {
      // Insert new config
      const { data, error } = await supabase
        .from('smtp_configs')
        .insert({
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          from_email: config.fromEmail,
          from_name: config.fromName
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error("Error saving SMTP config:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save SMTP configuration"
    };
  }
};

export const getEmailConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('smtp_configs')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No config found
        return { success: false, message: "No SMTP configuration found" };
      }
      throw error;
    }
    
    return { 
      success: true, 
      config: {
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password,
        fromEmail: data.from_email,
        fromName: data.from_name
      } 
    };
  } catch (error) {
    console.error("Error fetching SMTP config:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch SMTP configuration"
    };
  }
};
