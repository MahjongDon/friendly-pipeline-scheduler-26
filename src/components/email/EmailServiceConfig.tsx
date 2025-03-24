
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
import { AlertCircle, HelpCircle, ExternalLink, Info, Lock, X, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

interface EmailServiceConfigProps {
  service: EmailService;
  onSave: (service: EmailService, config: any) => void;
  onCancel: () => void;
}

// Gmail OAuth2 Help Component
const GmailOAuthHelp = () => (
  <div className="space-y-2 text-sm">
    <h3 className="font-semibold">Setting up Gmail OAuth2</h3>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Go to the <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
      <li>Create a new project</li>
      <li>Enable the Gmail API</li>
      <li>Configure the OAuth consent screen</li>
      <li>Create OAuth credentials (client ID and client secret)</li>
      <li>Use the OAuth Playground to get a refresh token:
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OAuth Playground</a></li>
          <li>Click the settings icon (⚙️) and check "Use your own OAuth credentials"</li>
          <li>Enter your Client ID and Client Secret</li>
          <li>Select "Gmail API v1" and the scopes <code>https://mail.google.com/</code></li>
          <li>Click "Authorize APIs" and follow the prompts</li>
          <li>Click "Exchange authorization code for tokens"</li>
          <li>Copy the refresh token for use in this form</li>
        </ul>
      </li>
    </ol>
  </div>
);

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
  
  const renderSmtpForm = () => (
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
                  <p className="text-xs">Recommended port: 587 (TLS). Port 465 (SSL) has compatibility issues.</p>
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
        <Label>Authentication Method</Label>
        <RadioGroup 
          value={authMethod} 
          onValueChange={(value) => setAuthMethod(value as "plain" | "oauth2")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="plain" id="auth-plain" />
            <Label htmlFor="auth-plain" className="cursor-pointer">Plain Password</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oauth2" id="auth-oauth2" />
            <Label htmlFor="auth-oauth2" className="cursor-pointer">OAuth2 (Required for Gmail)</Label>
            
            {host.includes("gmail") && authMethod === "oauth2" && (
              <Button 
                variant="ghost" 
                size="sm" 
                type="button" 
                onClick={() => setIsHelpOpen(true)}
                className="p-1 h-auto text-xs text-blue-600"
              >
                Need help?
              </Button>
            )}
          </div>
        </RadioGroup>
      </div>
      
      {authMethod === "plain" ? (
        <div className="space-y-2">
          <Label htmlFor="smtp-password">Password</Label>
          <Input 
            id="smtp-password" 
            type="password" 
            placeholder="Your SMTP password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {host.includes("gmail") && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Gmail no longer supports password authentication. Please use OAuth2 instead.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          <h4 className="font-medium text-sm flex justify-between items-center">
            <span>OAuth2 Credentials</span>
            {host.includes("gmail") && (
              <Button 
                variant="outline" 
                size="sm" 
                type="button" 
                onClick={() => setIsHelpOpen(true)}
                className="h-7 text-xs px-2"
              >
                <Info className="h-3 w-3 mr-1" /> OAuth2 Setup Guide
              </Button>
            )}
          </h4>
          <div className="space-y-2">
            <Label htmlFor="client-id">Client ID</Label>
            <Input 
              id="client-id" 
              placeholder="Your OAuth2 Client ID" 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-secret">Client Secret</Label>
            <Input 
              id="client-secret" 
              type="password"
              placeholder="Your OAuth2 Client Secret" 
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refresh-token">Refresh Token</Label>
            <Input 
              id="refresh-token" 
              type="password"
              placeholder="Your OAuth2 Refresh Token" 
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token (Optional)</Label>
            <Input 
              id="access-token" 
              type="password"
              placeholder="Your OAuth2 Access Token (optional)" 
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>
        </div>
      )}
      
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
  );
  
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
            You can get your API key from the <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SendGrid API Keys page</a>.
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
      
      {service.name === "Amazon SES" && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-2">
          <p className="font-medium">AWS Region Note:</p>
          <p>The region will be extracted from your AWS credentials automatically.</p>
        </div>
      )}
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
    <>
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

          {cloudLimitation && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
              <h4 className="font-medium mb-1 flex items-center">
                Using Gmail API for Email Sending
              </h4>
              <p className="text-sm mb-2">
                Direct SMTP connections don't work in serverless environments, but don't worry! 
                For Gmail, we'll use the Gmail API behind the scenes instead of SMTP.
              </p>
              <div className="text-sm mb-2">
                <strong>Benefits:</strong>
                <ul className="list-disc ml-5 space-y-1 mt-1">
                  <li>Works reliably in cloud environments</li>
                  <li>No need for SMTP port configuration</li>
                  <li>Better security with OAuth2</li>
                </ul>
              </div>
              <p className="text-sm">
                Just configure your OAuth2 credentials and we'll handle the rest!
              </p>
            </div>
          )}
          
          {service.name === "SMTP" && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <h4 className="font-medium mb-1">Configuration Tips</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>For Gmail, you must use OAuth2 authentication</li>
                <li>We recommend port 587 for most reliable results</li>
                <li>For Gmail specifically, we'll use the Gmail API instead of SMTP for better reliability</li>
              </ul>
            </div>
          )}
          
          <form id="email-service-form" onSubmit={handleSave}>
            {service.name === "SMTP" ? renderSmtpForm() : renderApiForm()}
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

      {/* Help Drawer - Slides in from the side instead of cluttering the main UI */}
      <Drawer open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader className="border-b">
            <DrawerTitle>Gmail OAuth2 Setup Guide</DrawerTitle>
          </DrawerHeader>
          <div className="p-6">
            <GmailOAuthHelp />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close Guide</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EmailServiceConfig;
