
import React, { useState, useEffect } from "react";
import { Mail, Link, AlertCircle, CheckCircle, LogIn } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailService } from "@/types/emailAutomation";
import { toast } from "sonner";
import EmailServiceConfig from "./EmailServiceConfig";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const [services, setServices] = useState<EmailService[]>(emailServices);
  const [selectedService, setSelectedService] = useState<EmailService | null>(null);
  const [activeTab, setActiveTab] = useState("services");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);
  
  const handleConfigureService = (service: EmailService) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to configure email services");
      onOpenChange(false);
      navigate("/auth"); // Assuming you have an auth route
      return;
    }
    
    setSelectedService(service);
    setActiveTab("configure");
  };
  
  const handleSaveConfiguration = (service: EmailService, config: any) => {
    // Here you would normally save the configuration to your backend
    console.log("Configuration saved for", service.name, config);
    
    // Update the local state
    const updatedServices = services.map(s => 
      s.name === service.name ? service : s
    );
    
    setServices(updatedServices);
    setSelectedService(null);
    setActiveTab("services");
    
    toast.success(`${service.name} configured successfully`);
  };
  
  const handleCancelConfiguration = () => {
    setSelectedService(null);
    setActiveTab("services");
  };

  const renderAuthWarning = () => {
    if (isAuthenticated === false) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">Authentication Required</h3>
              <p className="text-sm text-red-700 mt-1">
                You need to be logged in to configure and use email services.
              </p>
              <Button 
                className="mt-2" 
                size="sm" 
                onClick={() => {
                  onOpenChange(false);
                  navigate("/auth");
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Set Up Email Service</DialogTitle>
          <DialogDescription>
            To send real emails, you need to connect to an email service
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList>
            <TabsTrigger value="services">Email Services</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedService}>
              Configure Service
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <div className="py-4">
              {renderAuthWarning()}
              
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
                {services.map((service) => (
                  <Card key={service.name}>
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        Status: <span className={service.isConfigured ? "text-green-600 flex items-center" : "text-amber-600"}>
                          {service.isConfigured ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Connected
                            </>
                          ) : "Not configured"}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={service.isConfigured ? "outline" : "default"} 
                        className="w-full"
                        onClick={() => handleConfigureService(service)}
                        disabled={isAuthenticated === false}
                      >
                        {service.isConfigured ? "Edit Configuration" : `Configure ${service.name}`}
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
          </TabsContent>
          
          <TabsContent value="configure">
            {selectedService && (
              <EmailServiceConfig
                service={selectedService}
                onSave={handleSaveConfiguration}
                onCancel={handleCancelConfiguration}
              />
            )}
          </TabsContent>
        </Tabs>
        
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
