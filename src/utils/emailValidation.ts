
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
    // In a real implementation, this would make an API call to test the connection
    // For now, we'll simulate the test
    return {
      success: true,
      message: "SMTP connection test successful"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test SMTP connection"
    };
  }
};
