
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SMTPConfigForm from "./SMTPConfigForm";

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
  const [authMethod, setAuthMethod] = useState<"plain" | "oauth2">("plain");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [cloudLimitation, setCloudLimitation] = useState(false);
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
            setAuthMethod((config.authMethod || "plain") as "plain" | "oauth2");
            
            // Auth method specific fields
            if (config.authMethod === "oauth2") {
              setClientId(config.clientId || "");
              setClientSecret(config.clientSecret || "");
              setRefreshToken(config.refreshToken || "");
              setAccessToken(config.accessToken || "");
            } else {
              // We don't set the password here for security reasons
            }
            
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
          config = { 
            host, 
            port, 
            username, 
            authMethod,
            fromEmail, 
            fromName 
          };
          
          if (authMethod === "plain") {
            config.password = password;
          } else {
            config.clientId = clientId;
            config.clientSecret = clientSecret;
            config.refreshToken = refreshToken;
            config.accessToken = accessToken;
          }
          
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
      setCloudLimitation(false);
      
      try {
        const config: any = { 
          host, 
          port, 
          username, 
          authMethod,
          fromEmail, 
          fromName 
        };
        
        if (authMethod === "plain") {
          config.password = password;
        } else {
          config.clientId = clientId;
          config.clientSecret = clientSecret;
          config.refreshToken = refreshToken;
          config.accessToken = accessToken;
        }
        
        const validationResult = validateEmailConfig(config);
        
        if (!validationResult.isValid) {
          validationResult.errors.forEach(error => toast.error(error));
          setConfigError("Please fix the validation errors");
          setIsTesting(false);
          return;
        }
        
        toast.info("Testing email connection, please wait...");
        const testResult = await testEmailConfig(config);
        
        if (testResult.success) {
          toast.success(testResult.message || "Email connection test successful");
        } else {
          // Show cloud limitation message regardless when it comes to Gmail OAuth
          if (host.includes("gmail") && authMethod === "oauth2") {
            setCloudLimitation(true);
            toast.error("Gmail SMTP connections often fail in serverless environments. We'll use the Gmail API instead.");
          } else {
            toast.error(testResult.message || "Failed to test email connection");
          }
          
          setConfigError(testResult.message || "Failed to test email connection");
          
          if (testResult.diagnosticInfo) {
            setDiagnosticInfo(testResult.diagnosticInfo);
          }
          
          if (testResult.cloudLimitation) {
            setCloudLimitation(true);
          }
          
          // Special handling for the port 465 error
          if (testResult.message && testResult.message.includes("Deno.writeAll is not a function")) {
            setConfigError("There's a compatibility issue with port 465. Please use port 587 instead.");
            setDiagnosticInfo("Our email service has a technical limitation with port 465. Port 587 (TLS) works more reliably.");
          }
        }
      } catch (error) {
        toast.error("Failed to test email connection");
        console.error("SMTP test error:", error);
        setConfigError("Failed to test connection: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setIsTesting(false);
      }
    }
  };
  
  const renderApiForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="api-key">{service.name} API Key</Label>
        <Input 
          id="api-key" 
          placeholder="Enter your API key" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        {service.name === "SendGrid" && (
          <p className="text-xs text-gray-500 mt-1">
            You can get your API key from the SendGrid API Keys page.
          </p>
        )}
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
    </div>
  );
  
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
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Configure {service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {configError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm">{configError}</p>
                {diagnosticInfo && (
                  <p className="text-sm mt-1 text-destructive/80">
                    <span className="font-medium">Diagnostic info:</span> {diagnosticInfo}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {service.name === "SMTP" && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <AlertDescription>
              <h4 className="font-medium mb-1">Configuration Tips</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>For Gmail, you must use OAuth2 authentication</li>
                <li>We recommend port 587 for most reliable results</li>
                <li>For Gmail specifically, we'll use the Gmail API instead of SMTP for better reliability</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
          
        <form id="email-service-form" onSubmit={handleSave}>
          {service.name === "SMTP" ? (
            <SMTPConfigForm 
              host={host}
              setHost={setHost}
              port={port}
              setPort={setPort}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              fromEmail={fromEmail}
              setFromEmail={setFromEmail}
              fromName={fromName}
              setFromName={setFromName}
              authMethod={authMethod}
              setAuthMethod={setAuthMethod}
              clientId={clientId}
              setClientId={setClientId}
              clientSecret={clientSecret}
              setClientSecret={setClientSecret}
              refreshToken={refreshToken}
              setRefreshToken={setRefreshToken}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              cloudLimitation={cloudLimitation}
            />
          ) : renderApiForm()}
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
