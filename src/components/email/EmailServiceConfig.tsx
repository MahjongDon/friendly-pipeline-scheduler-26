
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/types/emailAutomation";
import { 
  validateEmailConfig, 
  testEmailConfig,
  saveEmailConfig,
  getEmailConfig 
} from "@/utils/emailValidation";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, HelpCircle, ExternalLink, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmailServiceConfigProps {
  service: EmailService;
  onSave: (service: EmailService, config: any) => void;
  onCancel: () => void;
}

const EmailServiceConfig: React.FC<EmailServiceConfigProps> = ({
  service,
  onSave,
  onCancel
}) => {
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("smtp.gmail.com"); // Default for Gmail
  const [port, setPort] = useState("587"); // Default TLS port
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to configure email services");
      onCancel();
      return;
    }
    
    // Load existing configuration from Supabase if available
    if (service.name === "SMTP") {
      const loadConfig = async () => {
        setIsLoading(true);
        setConfigError(null);
        
        try {
          const result = await getEmailConfig();
          if (result.success && result.config) {
            const config = result.config;
            setHost(config.host || "smtp.gmail.com");
            setPort(config.port || "587");
            setUsername(config.username || "");
            setFromEmail(config.fromEmail || "");
            setFromName(config.fromName || "");
            // We don't set the password here for security reasons
            toast.info("Loaded existing SMTP configuration");
          }
        } catch (error) {
          console.error("Error loading SMTP config:", error);
          setConfigError("Failed to load existing configuration");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadConfig();
    } else {
      setIsLoading(false);
    }
  }, [service.name, onCancel, user]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setConfigError(null);
    
    let config: any = {};
    let validationResult;
    
    try {
      switch (service.name) {
        case "SMTP":
          config = { host, port, username, password, fromEmail, fromName };
          validationResult = validateEmailConfig(config);
          
          if (!validationResult.isValid) {
            validationResult.errors.forEach(error => toast.error(error));
            setConfigError("Please fix the validation errors");
            setIsSaving(false);
            return;
          }
          
          // Save to Supabase
          const saveResult = await saveEmailConfig(config);
          if (!saveResult.success) {
            toast.error(saveResult.message || "Failed to save configuration");
            setConfigError(saveResult.message || "Failed to save configuration");
            setIsSaving(false);
            return;
          }
          
          break;
        
        case "SendGrid":
        case "Mailchimp":
        case "Amazon SES":
          if (!apiKey || !fromEmail) {
            toast.error("API key and From Email are required");
            setConfigError("API key and From Email are required");
            setIsSaving(false);
            return;
          }
          config = { apiKey, fromEmail, fromName };
          // Store API service configs if needed in future
          break;
      }
      
      const updatedService = {
        ...service,
        isConfigured: true
      };
      
      onSave(updatedService, config);
      toast.success(`${service.name} configuration saved successfully`);
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Failed to save configuration");
      setConfigError("Failed to save configuration: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTest = async () => {
    if (service.name === "SMTP") {
      setIsTesting(true);
      setConfigError(null);
      setDiagnosticInfo(null);
      
      try {
        const config = { host, port, username, password, fromEmail, fromName };
        const validationResult = validateEmailConfig(config);
        
        if (!validationResult.isValid) {
          validationResult.errors.forEach(error => toast.error(error));
          setConfigError("Please fix the validation errors");
          setIsTesting(false);
          return;
        }
        
        toast.info("Testing SMTP connection, please wait...");
        const testResult = await testEmailConfig(config);
        
        if (testResult.success) {
          toast.success(testResult.message || "SMTP connection test successful");
        } else {
          toast.error(testResult.message || "Failed to test SMTP connection");
          setConfigError(testResult.message || "Failed to test SMTP connection");
          
          if (testResult.diagnosticInfo) {
            setDiagnosticInfo(testResult.diagnosticInfo);
          }
        }
      } catch (error) {
        toast.error("Failed to test SMTP connection");
        console.error("SMTP test error:", error);
        setConfigError("Failed to test SMTP connection: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setIsTesting(false);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading configuration...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure {service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {configError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm">{configError}</p>
              {diagnosticInfo && (
                <p className="text-sm mt-1 text-red-700">
                  <span className="font-medium">Diagnostic info:</span> {diagnosticInfo}
                </p>
              )}
            </div>
          </div>
        )}
        
        {service.name === "SMTP" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            <h4 className="font-medium mb-1 flex items-center">
              Gmail SMTP Setup Help
              <a 
                href="https://support.google.com/accounts/answer/185833?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 hover:underline inline-flex items-center"
              >
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </h4>
            <p className="text-sm mb-2">
              If you're using Gmail, you'll need to use an App Password instead of your regular password.
            </p>
            <ol className="text-sm list-decimal pl-5 space-y-1">
              <li>Enable 2-Step Verification on your Google account</li>
              <li>Go to your Google Account settings</li>
              <li>Select "Security"</li>
              <li>Under "Signing in to Google," select "App passwords"</li>
              <li>Generate a new app password for "Mail"</li>
              <li>Use that 16-character password here</li>
            </ol>
          </div>
        )}
        
        {service.name === "SMTP" && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <h4 className="font-medium mb-1">Troubleshooting Tips</h4>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Ensure you're using an app password if using Gmail</li>
              <li>Check if your email provider requires specific port settings</li>
              <li>Some email providers may have additional security settings that need to be enabled</li>
              <li>Check your spam folder for the test email</li>
              <li>Try port 465 for SSL connections if port 587 (TLS) fails</li>
              <li>Make sure your email service allows Less Secure App access or has app passwords enabled</li>
              <li>Some email providers may block connections from cloud environments</li>
            </ul>
          </div>
        )}
        
        <form id="email-service-form" onSubmit={handleSave}>
          {service.name === "SMTP" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input 
                    id="smtp-host" 
                    placeholder="smtp.gmail.com" 
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="smtp-port" 
                      placeholder="587" 
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-username">Username (Email)</Label>
                <Input 
                  id="smtp-username" 
                  type="email"
                  placeholder="your.email@gmail.com" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password (App Password for Gmail)</Label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  placeholder="Your SMTP password or Gmail App Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input 
                    id="from-email" 
                    type="email"
                    placeholder="noreply@yourcompany.com" 
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name (Optional)</Label>
                  <Input 
                    id="from-name" 
                    placeholder="Your Company Name" 
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">{service.name} API Key</Label>
                <Input 
                  id="api-key" 
                  placeholder="Enter your API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input 
                    id="from-email" 
                    placeholder="noreply@yourcompany.com" 
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name (Optional)</Label>
                  <Input 
                    id="from-name" 
                    placeholder="Your Company Name" 
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                  />
                </div>
              </div>
              
              {service.name === "Amazon SES" && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-2">
                  <p className="font-medium">AWS Region Note:</p>
                  <p>The region will be extracted from your AWS credentials automatically.</p>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {service.name === "SMTP" && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
        )}
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" form="email-service-form" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailServiceConfig;
