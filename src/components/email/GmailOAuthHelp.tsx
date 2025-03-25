
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const GmailOAuthHelp: React.FC = () => {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold">Setting up Gmail OAuth2</h3>
      <ol className="list-decimal pl-5 space-y-3">
        <li>
          Go to the{" "}
          <a
            href="https://console.developers.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            Google Cloud Console
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </li>
        <li>Create a new project</li>
        <li>Enable the Gmail API</li>
        <li>Configure the OAuth consent screen</li>
        <li>
          <strong>IMPORTANT:</strong> Select the following scopes:
          <code className="bg-gray-100 px-1 rounded block mt-1 mb-1">
            https://mail.google.com/
          </code>
          (This scope is required for sending emails via the Gmail API)
        </li>
        <li>Create OAuth credentials (client ID and client secret)</li>
        <li>
          For "Authorized redirect URIs", add:
          <code className="bg-gray-100 px-1 rounded block mt-1 mb-1">
            https://developers.google.com/oauthplayground
          </code>
        </li>
        <li>
          Use the OAuth Playground to get a refresh token:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              Go to{" "}
              <a
                href="https://developers.google.com/oauthplayground/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                OAuth Playground
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>
              Click the settings icon (⚙️) and check "Use your own OAuth
              credentials"
            </li>
            <li>Enter your Client ID and Client Secret</li>
            <li>
              Select "Gmail API v1" and the scope{" "}
              <code className="bg-gray-100 px-1 rounded">
                https://mail.google.com/
              </code>
            </li>
            <li>Click "Authorize APIs" and follow the prompts</li>
            <li>Click "Exchange authorization code for tokens"</li>
            <li>Copy the refresh token for use in this form</li>
          </ul>
        </li>
        <li>
          <strong>Browser/Localhost Restrictions:</strong> If testing locally, make sure to add <code>http://localhost</code> to "Authorized JavaScript origins" in your Google OAuth credentials.
        </li>
      </ol>
    </div>
  );
};

export default GmailOAuthHelp;
