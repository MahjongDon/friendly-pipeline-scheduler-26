
import React, { useState } from "react";
import { Book, Mail, MessageSquare, ExternalLink, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Help: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const faqs = [
    {
      question: "How do I create a new contact?",
      answer: "You can create a new contact by navigating to the Contacts page and clicking on the 'Add Contact' button in the top right corner. Fill out the required information in the form that appears and click 'Save'."
    },
    {
      question: "How do I add a task?",
      answer: "To add a new task, go to the Tasks page and use the 'Add Task' button at the top of the page. Enter the task details in the form that appears and click 'Save'."
    },
    {
      question: "Can I export my contacts list?",
      answer: "Yes, you can export your contacts list by going to the Contacts page, clicking on the 'More' button in the top right corner, and selecting 'Export' from the dropdown menu."
    },
    {
      question: "How do I create a new deal in the pipeline?",
      answer: "To create a new deal, navigate to the Pipeline page and click on the 'Add Deal' button. Fill in the details for your new deal and select which stage of the pipeline it belongs to."
    },
    {
      question: "How do I set up email notifications?",
      answer: "Email notifications can be configured in the Settings page. Navigate to Settings, click on the 'Notifications' tab, and toggle on the 'Email Notifications' option."
    },
    {
      question: "How do I change my password?",
      answer: "To change your password, go to the Settings page, select the 'Security' tab, and fill out the password change form with your current password and new password."
    },
  ];

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Help & Support</h1>
            <p className="text-muted-foreground">Get help with using the CRM Suite</p>
          </div>
          
          <div className="bg-primary-foreground mb-6 p-8 rounded-lg border text-center">
            <h2 className="text-xl font-semibold mb-4">How can we help you today?</h2>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 mb-4"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="text-center p-4">
                    <Book className="h-6 w-6 mx-auto mb-2" />
                    <CardTitle className="text-base">Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-center px-4 pb-4">
                    <p>Browse our detailed documentation</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 justify-center">
                    <Button variant="outline" size="sm">
                      View docs
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="text-center p-4">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                    <CardTitle className="text-base">Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-center px-4 pb-4">
                    <p>Chat with our support team</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 justify-center">
                    <Button size="sm">Start chat</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="text-center p-4">
                    <Mail className="h-6 w-6 mx-auto mb-2" />
                    <CardTitle className="text-base">Email Support</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-center px-4 pb-4">
                    <p>Send us an email</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 justify-center">
                    <Button variant="outline" size="sm">
                      Send email
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="bg-white rounded-lg border">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  </div>
                )}
              </Accordion>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Video Tutorials</h2>
              
              <div className="space-y-4 bg-white p-4 rounded-lg border">
                <div className="border-b pb-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-primary/90 text-primary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 ml-1">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </Button>
                  </div>
                  <h3 className="font-medium">Getting Started with CRM Suite</h3>
                  <p className="text-sm text-muted-foreground">Learn the basics of navigating the CRM Suite</p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium">Managing Your Pipeline</h3>
                  <p className="text-sm text-muted-foreground">Learn how to effectively manage your sales pipeline</p>
                  <Button variant="link" size="sm" className="p-0 h-8">
                    Watch tutorial <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium">Creating and Managing Tasks</h3>
                  <p className="text-sm text-muted-foreground">Learn about task management features</p>
                  <Button variant="link" size="sm" className="p-0 h-8">
                    Watch tutorial <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium">Contact Management</h3>
                  <p className="text-sm text-muted-foreground">Learn how to manage your contacts efficiently</p>
                  <Button variant="link" size="sm" className="p-0 h-8">
                    Watch tutorial <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 text-center">
            <h2 className="text-lg font-medium mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-4">Our support team is available 24/7 to assist you with any questions</p>
            <div className="flex justify-center gap-4">
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" /> Contact Support
              </Button>
              <Button variant="outline">
                <Book className="h-4 w-4 mr-2" /> Browse Knowledge Base
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
