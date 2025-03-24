
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/types/emailAutomation";

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
  const [host, setHost] = useState("");
  const [port, setPort] = useState("587");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let config: any = {};
    let isValid = true;
    let errorMessage = "";
    
    switch (service.name) {
      case "SMTP":
        if (!host || !username || !password || !port || !fromEmail) {
          isValid = false;
          errorMessage = "All SMTP fields are required";
        } else {
          config = { host, port, username, password, fromEmail, fromName };
        }
        break;
      
      case "SendGrid":
      case "Mailchimp":
      case "Amazon SES":
        if (!apiKey || !fromEmail) {
          isValid = false;
          errorMessage = "API key and From Email are required";
        } else {
          config = { apiKey, fromEmail, fromName };
        }
        break;
    }
    
    if (!isValid) {
      toast.error(errorMessage);
      return;
    }
    
    const updatedService = {
      ...service,
      isConfigured: true
    };
    
    onSave(updatedService, config);
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
                    placeholder="smtp.example.com" 
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
                <Label htmlFor="smtp-username">Username</Label>
                <Input 
                  id="smtp-username" 
                  placeholder="username@example.com" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  placeholder="Your SMTP password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
