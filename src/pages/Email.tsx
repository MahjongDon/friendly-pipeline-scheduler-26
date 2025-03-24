import React, { useState, useEffect } from "react";
import { Check, Cog, Plus, Search, Trash, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ComposeDialog from "@/components/email/ComposeDialog";
import { toast } from "sonner";
import { EmailTemplate } from "@/types/emailAutomation";
import { sampleTemplates } from "@/data/sampleEmailData";
import EmailSetupDialog from "@/components/email/EmailSetupDialog";
import { emailServices } from "@/types/emailAutomation";
import { getEmailConfig, sendEmail } from "@/utils/emailValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const emails = [
  {
    id: "email-1",
    from: "John Smith <john.smith@acme.com>",
    to: "you@company.com",
    subject: "Meeting tomorrow",
    body: "Hi there,\n\nJust confirming our meeting tomorrow at 2pm.\n\nBest,\nJohn",
    date: "2023-12-10T14:30:00",
    read: true,
    folder: "inbox",
    important: false,
  },
  {
    id: "email-2",
    from: "Sarah Johnson <sarah.j@globex.com>",
    to: "you@company.com",
    subject: "Proposal Review",
    body: "Hello,\n\nI've reviewed the proposal and have some feedback. Can we discuss this afternoon?\n\nRegards,\nSarah",
    date: "2023-12-10T10:15:00",
    read: false,
    folder: "inbox",
    important: true,
  },
  {
    id: "email-3",
    from: "Michael Brown <m.brown@wayne.com>",
    to: "you@company.com",
    subject: "Invoice #1234",
    body: "Dear Customer,\n\nPlease find attached the invoice for your recent purchase.\n\nThank you for your business.\n\nMichael Brown\nAccounting Department",
    date: "2023-12-09T16:45:00",
    read: true,
    folder: "inbox",
    important: false,
  },
  {
    id: "email-4",
    from: "Jessica Lee <jessica@stark.com>",
    to: "you@company.com",
    subject: "Product Inquiry",
    body: "Hi,\n\nI'm interested in learning more about your services. Do you offer consulting?\n\nThanks,\nJessica",
    date: "2023-12-08T09:22:00",
    read: true,
    folder: "inbox",
    important: false,
  },
  {
    id: "email-5",
    from: "you@company.com",
    to: "robert.chen@oscorp.com",
    subject: "Following up on our conversation",
    body: "Hi Robert,\n\nIt was great speaking with you yesterday. I'm following up as promised with more information about our services.\n\nBest regards,\nYou",
    date: "2023-12-07T15:30:00",
    read: true,
    folder: "sent",
    important: false,
  },
];

const Email = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkEmailConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getEmailConfig();
        setEmailConfigured(result.success);
      } catch (error) {
        console.error("Error checking email config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkEmailConfig();
  }, []);
  
  const filteredEmails = emails
    .filter(email => email.folder === selectedFolder)
    .filter(email => 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  const handleDeleteEmail = (emailId: string) => {
    toast.success("Email deleted successfully");
  };
  
  const handleSendEmail = async (emailData: { to: string; subject: string; body: string }) => {
    if (emailConfigured) {
      try {
        const result = await sendEmail(emailData);
        
        if (result.success) {
          toast.success("Email sent successfully");
        } else {
          toast.error(`Failed to send email: ${result.message}`);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email due to an unexpected error");
      }
    } else {
      toast.success("Email sent successfully (simulation)");
    }
    
    setIsComposeOpen(false);
  };
  
  const handleMarkAsRead = (emailId: string) => {
    toast.success("Email marked as read");
  };
  
  const handleMarkAsImportant = (emailId: string) => {
    toast.success("Email marked as important");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Email</h1>
              <p className="text-muted-foreground">Manage your email communications</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsSetupOpen(true)}
                variant="outline"
                className="flex items-center"
              >
                <Cog className="h-4 w-4 mr-2" />
                Email Settings
              </Button>
              <Button onClick={() => setIsComposeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Compose
              </Button>
            </div>
          </div>
          
          {!isLoading && !emailConfigured && (
            <Alert className="mb-6 bg-amber-50 border-amber-200 flex items-center">
              <AlertDescription className="flex items-center">
                <Mail className="h-5 w-5 text-amber-600 mr-2" />
                <div>
                  <span className="font-medium text-amber-800">Email service not configured</span>
                  <span className="ml-2 text-amber-700">
                    Currently using simulated email sending.
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="ml-3 bg-white"
                    onClick={() => setIsSetupOpen(true)}
                  >
                    Configure Email
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && emailConfigured && (
            <Alert className="mb-6 bg-green-50 border-green-200 flex items-center">
              <AlertDescription className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <span className="font-medium text-green-800">Email service configured</span>
                  <span className="ml-2 text-green-700">
                    Your application is ready to send real emails.
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="ml-3 bg-white"
                    onClick={() => setIsSetupOpen(true)}
                  >
                    Manage Settings
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="mb-4">
                  <Button 
                    className="w-full mb-3" 
                    onClick={() => setIsComposeOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Compose
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsSetupOpen(true)}
                  >
                    <Cog className="h-4 w-4 mr-2" /> Email Settings
                  </Button>
                </div>
                <div className="space-y-1">
                  <Button 
                    variant={selectedFolder === "inbox" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder("inbox")}
                  >
                    Inbox (4)
                  </Button>
                  <Button 
                    variant={selectedFolder === "sent" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder("sent")}
                  >
                    Sent (1)
                  </Button>
                  <Button 
                    variant={selectedFolder === "drafts" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder("drafts")}
                  >
                    Drafts (0)
                  </Button>
                  <Button 
                    variant={selectedFolder === "trash" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder("trash")}
                  >
                    Trash (0)
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Search emails..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Emails</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex h-[600px]">
                  <div className={cn(
                    "border-r w-full overflow-auto",
                    selectedEmail && !isMobile ? "w-1/3" : "w-full"
                  )}>
                    {filteredEmails.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        No emails found
                      </div>
                    ) : (
                      filteredEmails.map(email => (
                        <div 
                          key={email.id}
                          className={cn(
                            "border-b p-4 cursor-pointer hover:bg-gray-50",
                            !email.read && "bg-blue-50 hover:bg-blue-50",
                            selectedEmail === email.id && "bg-gray-100 hover:bg-gray-100"
                          )}
                          onClick={() => setSelectedEmail(email.id)}
                        >
                          <div className="flex justify-between mb-1">
                            <div className="font-medium truncate">
                              {email.folder === "sent" ? `To: ${email.to}` : email.from.split("<")[0]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(email.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="font-medium mb-1 truncate">
                            {email.subject}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {email.body.split('\n')[0]}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {selectedEmail && (!isMobile || !selectedEmail) && (
                    <div className={cn(
                      "p-6 overflow-auto",
                      !isMobile ? "w-2/3" : "w-full"
                    )}>
                      {emails.find(e => e.id === selectedEmail) && (
                        <>
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h2 className="text-xl font-semibold mb-2">
                                {emails.find(e => e.id === selectedEmail)?.subject}
                              </h2>
                              <div className="text-sm text-muted-foreground mb-1">
                                <span className="font-medium">From:</span> {emails.find(e => e.id === selectedEmail)?.from}
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">
                                <span className="font-medium">To:</span> {emails.find(e => e.id === selectedEmail)?.to}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">Date:</span> {new Date(emails.find(e => e.id === selectedEmail)?.date || "").toLocaleString()}
                              </div>
                            </div>
                            <div className="flex">
                              {emails.find(e => e.id === selectedEmail)?.folder !== "sent" && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mr-2"
                                    onClick={() => handleMarkAsRead(selectedEmail)}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </Button>
                                </>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteEmail(selectedEmail)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="whitespace-pre-wrap">
                            {emails.find(e => e.id === selectedEmail)?.body}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <ComposeDialog
            isOpen={isComposeOpen}
            onOpenChange={setIsComposeOpen}
            onSend={handleSendEmail}
            templates={sampleTemplates}
            usingRealEmailService={emailConfigured}
          />
          
          <EmailSetupDialog
            isOpen={isSetupOpen}
            onOpenChange={setIsSetupOpen}
            emailServices={emailServices}
          />
        </main>
      </div>
    </div>
  );
};

export default Email;
