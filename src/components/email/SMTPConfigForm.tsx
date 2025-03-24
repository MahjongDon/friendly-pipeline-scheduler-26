
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle, Info, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GmailOAuthHelp from "./GmailOAuthHelp";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SMTPConfigFormProps {
  host: string;
  setHost: (value: string) => void;
  port: string;
  setPort: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fromEmail: string;
  setFromEmail: (value: string) => void;
  fromName: string;
  setFromName: (value: string) => void;
  authMethod: "plain" | "oauth2";
  setAuthMethod: (value: "plain" | "oauth2") => void;
  clientId: string;
  setClientId: (value: string) => void;
  clientSecret: string;
  setClientSecret: (value: string) => void;
  refreshToken: string;
  setRefreshToken: (value: string) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  cloudLimitation: boolean;
}

const SMTPConfigForm: React.FC<SMTPConfigFormProps> = ({
  host,
  setHost,
  port,
  setPort,
  username,
  setUsername,
  password,
  setPassword,
  fromEmail,
  setFromEmail,
  fromName,
  setFromName,
  authMethod,
  setAuthMethod,
  clientId,
  setClientId,
  clientSecret,
  setClientSecret,
  refreshToken,
  setRefreshToken,
  accessToken,
  setAccessToken,
  cloudLimitation
}) => {
  return (
    <div className="space-y-4">
      {cloudLimitation && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertDescription>
            <h4 className="font-medium mb-1">
              Using Gmail API for Email Sending
            </h4>
            <p className="text-sm mb-2">
              For Gmail, we'll use the Gmail API instead of SMTP for better reliability in cloud environments.
            </p>
          </AlertDescription>
        </Alert>
      )}

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
        <div className="flex flex-col sm:flex-row sm:items-center">
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
              <Label htmlFor="auth-oauth2" className="cursor-pointer">OAuth2</Label>
            </div>
          </RadioGroup>

          {host.includes("gmail") && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:ml-auto mt-2 sm:mt-0">
                  <Info className="h-4 w-4 mr-1" /> OAuth2 Guide
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[500px] max-w-full overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Gmail OAuth2 Setup Guide</SheetTitle>
                  <SheetDescription>
                    Follow these steps to set up OAuth2 authentication for Gmail
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <GmailOAuthHelp />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        {host.includes("gmail") && authMethod === "plain" && (
          <p className="text-xs text-red-600 mt-1 flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Gmail no longer supports password authentication. Please use OAuth2 instead.
          </p>
        )}
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
        </div>
      ) : (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          <h4 className="font-medium text-sm">OAuth2 Credentials</h4>
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
};

export default SMTPConfigForm;
