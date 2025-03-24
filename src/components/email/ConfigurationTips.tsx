
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const ConfigurationTips: React.FC = () => {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold">Email Configuration Tips</h3>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          <strong>For Gmail Users:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>You must use OAuth2 authentication (Gmail no longer supports password authentication)</li>
            <li>We'll use the Gmail API instead of SMTP for better reliability</li>
            <li>Follow the OAuth2 Guide to set up your credentials</li>
          </ul>
        </li>
        <li>
          <strong>SMTP Port Settings:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Port 587 (TLS) is recommended for most reliable results</li>
            <li>Port 465 (SSL) might have compatibility issues in cloud environments</li>
          </ul>
        </li>
        <li>
          <strong>Testing Recommendations:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Always test your configuration before using it in production</li>
            <li>If you encounter issues, check your credentials and network settings</li>
          </ul>
        </li>
        <li>
          <strong>Cloud Compatibility:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Direct SMTP connections might be blocked in some cloud environments</li>
            <li>Using API-based email services (Gmail API, SendGrid, etc.) is more reliable</li>
          </ul>
        </li>
      </ul>
      
      <h3 className="font-semibold mt-4">Useful Resources</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <a
            href="https://support.google.com/mail/answer/7126229"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            Gmail SMTP Settings
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </li>
        <li>
          <a
            href="https://developers.google.com/gmail/api/guides"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            Gmail API Documentation
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ConfigurationTips;
