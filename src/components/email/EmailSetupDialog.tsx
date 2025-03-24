
import React from "react";
import { Mail, Link, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailService } from "@/types/emailAutomation";

interface EmailSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  emailServices: EmailService[];
}

const EmailSetupDialog: React.FC<EmailSetupDialogProps> = ({
  isOpen,
  onOpenChange,
  emailServices,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Set Up Email Service</DialogTitle>
          <DialogDescription>
            To send real emails, you need to connect to an email service
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-amber-800">Email Sending Setup Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Currently, the application is using simulated email sending. To send real emails,
                  you'll need to integrate with an email service provider.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Available Email Services</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {emailServices.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    Status: <span className={service.isConfigured ? "text-green-600" : "text-amber-600"}>
                      {service.isConfigured ? "Connected" : "Not configured"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure {service.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Next Steps</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Choose an email service provider from the options above</li>
              <li>Sign up for an account if you don't already have one</li>
              <li>Configure your API keys or SMTP settings</li>
              <li>Complete the integration setup</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <a href="https://docs.lovable.dev" target="_blank" rel="noopener noreferrer">
              <Link className="h-4 w-4 mr-2" />
              View Documentation
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSetupDialog;
