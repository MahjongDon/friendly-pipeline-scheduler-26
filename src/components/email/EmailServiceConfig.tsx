
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/types/emailAutomation";
import { validateEmailConfig, testEmailConfig } from "@/utils/emailValidation";

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
  
  useEffect(() => {
    // Load saved configuration from localStorage if available
    const savedConfig = localStorage.getItem(`emailService_${service.name}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (service.name === "SMTP") {
        setHost(config.host || "smtp.gmail.com");
        setPort(config.port || "587");
        setUsername(config.username || "");
        setFromEmail(config.fromEmail || "");
        setFromName(config.fromName || "");
        // Don't load the password from localStorage for security
      }
    }
  }, [service.name]);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let config: any = {};
    let validationResult;
    
    switch (service.name) {
      case "SMTP":
        config = { host, port, username, password, fromEmail, fromName };
        validationResult = validateEmailConfig(config);
        
        if (!validationResult.isValid) {
          validationResult.errors.forEach(error => toast.error(error));
          return;
        }
        
        // Store in localStorage (except password)
        const storageConfig = { ...config };
        delete storageConfig.password;
        localStorage.setItem(`emailService_${service.name}`, JSON.stringify(storageConfig));
        break;
      
      case "SendGrid":
      case "Mailchimp":
      case "Amazon SES":
        if (!apiKey || !fromEmail) {
          toast.error("API key and From Email are required");
          return;
        }
        config = { apiKey, fromEmail, fromName };
        localStorage.setItem(`emailService_${service.name}`, JSON.stringify({ fromEmail, fromName }));
        break;
    }
    
    const updatedService = {
      ...service,
      isConfigured: true
    };
    
    onSave(updatedService, config);
    toast.success(`${service.name} configuration saved successfully`);
  };
  
  const handleTest = async () => {
    if (service.name === "SMTP") {
      setIsTesting(true);
      try {
        const config = { host, port, username, password, fromEmail, fromName };
        const validationResult = validateEmailConfig(config);
        
        if (!validationResult.isValid) {
          validationResult.errors.forEach(error => toast.error(error));
          return;
        }
        
        const testResult = await testEmailConfig(config);
        if (testResult.success) {
          toast.success(testResult.message);
        } else {
          toast.error(testResult.message);
        }
      } catch (error) {
        toast.error("Failed to test SMTP connection");
      } finally {
        setIsTesting(false);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure {service.name}</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Input 
                    id="smtp-port" 
                    placeholder="587" 
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  />
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="email-service-form">
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailServiceConfig;
