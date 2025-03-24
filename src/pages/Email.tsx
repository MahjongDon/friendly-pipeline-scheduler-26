
import React, { useState } from "react";
import { Inbox, Send, Archive, Star, Trash2, File, Search, Mail, MoreHorizontal, Settings, Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  folder: "inbox" | "sent" | "archive" | "draft" | "trash";
}

const sampleEmails: Email[] = [
  {
    id: "email-1",
    from: {
      name: "John Smith",
      email: "john.smith@acme.com",
    },
    to: {
      name: "Me",
      email: "user@example.com",
    },
    subject: "Meeting Proposal - Website Redesign Project",
    preview: "Hi there, I'd like to schedule a meeting to discuss the website redesign project for Acme Corp...",
    date: "2023-12-10T10:23:00",
    read: false,
    starred: true,
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: "email-2",
    from: {
      name: "Sarah Johnson",
      email: "sarah.j@globex.com",
    },
    to: {
      name: "Me",
      email: "user@example.com",
    },
    subject: "Marketing Campaign Proposal",
    preview: "Please find attached the proposal for the upcoming marketing campaign as discussed...",
    date: "2023-12-09T14:56:00",
    read: true,
    starred: false,
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: "email-3",
    from: {
      name: "CRM Suite",
      email: "notifications@crmsuite.com",
    },
    to: {
      name: "Me",
      email: "user@example.com",
    },
    subject: "Your Weekly Summary Report",
    preview: "Here's your weekly summary of activities in your CRM: 12 new leads, 5 deals progressed...",
    date: "2023-12-08T08:00:00",
    read: true,
    starred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "email-4",
    from: {
      name: "Me",
      email: "user@example.com",
    },
    to: {
      name: "Robert Chen",
      email: "robert.chen@oscorp.com",
    },
    subject: "Re: Software Implementation Timeline",
    preview: "Thank you for your patience. I've reviewed the timeline and would like to suggest...",
    date: "2023-12-07T16:30:00",
    read: true,
    starred: false,
    hasAttachment: false,
    folder: "sent",
  },
];

const EmailItem: React.FC<{ 
  email: Email;
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}> = ({ email, onToggleRead, onToggleStar }) => {
  const formattedDate = new Date(email.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div 
      className={cn(
        "flex items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors cursor-pointer",
        !email.read && "bg-blue-50/40"
      )}
      onClick={() => onToggleRead(email.id)}
    >
      <div className="flex items-center gap-3 w-64">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(email.id);
          }}
        >
          <Star className={cn(
            "h-4 w-4",
            email.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
          )} />
        </Button>
        
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {email.folder === "sent" ? (
            <Send className="h-4 w-4 text-primary" />
          ) : (
            email.from.name.charAt(0).toUpperCase()
          )}
        </div>
        
        <div className="font-medium truncate">
          {email.folder === "sent" ? email.to.name : email.from.name}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <span className={cn("font-medium", email.read && "font-normal")}>
          {email.subject}
        </span>
        <span className="text-sm text-muted-foreground truncate">{email.preview}</span>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {email.hasAttachment && (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
        
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Reply</DropdownMenuItem>
            <DropdownMenuItem>Forward</DropdownMenuItem>
            <DropdownMenuItem>Mark as {email.read ? "unread" : "read"}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const Email: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState(sampleEmails);
  const [currentFolder, setCurrentFolder] = useState<"inbox" | "sent" | "archive" | "draft" | "trash">("inbox");
  const isMobile = useIsMobile();
  
  const filteredEmails = emails
    .filter(email => email.folder === currentFolder)
    .filter(email => 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const handleToggleRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: !email.read } : email
    ));
  };
  
  const handleToggleStar = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
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
        
        <main className="flex h-[calc(100vh-64px)]">
          <div className="w-56 border-r bg-white">
            <div className="p-4 space-y-2">
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" /> Compose
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <RouterLink to="/email-automation">
                  <Settings className="h-4 w-4 mr-2" /> Email Automation
                </RouterLink>
              </Button>
            </div>
            
            <div className="space-y-1 px-2">
              <Button 
                variant={currentFolder === "inbox" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentFolder("inbox")}
              >
                <Inbox className="h-4 w-4 mr-2" /> 
                Inbox
                <Badge className="ml-auto">{emails.filter(e => e.folder === "inbox" && !e.read).length}</Badge>
              </Button>
              
              <Button 
                variant={currentFolder === "sent" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentFolder("sent")}
              >
                <Send className="h-4 w-4 mr-2" /> Sent
              </Button>
              
              <Button 
                variant={currentFolder === "archive" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentFolder("archive")}
              >
                <Archive className="h-4 w-4 mr-2" /> Archive
              </Button>
              
              <Button 
                variant={currentFolder === "trash" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setCurrentFolder("trash")}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Trash
              </Button>
            </div>
            
            <div className="px-4 py-2 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">Labels</h3>
            </div>
            
            <div className="space-y-1 px-2">
              <Button variant="ghost" className="w-full justify-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> 
                Work
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 
                Clients
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> 
                Personal
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="border-b p-4 bg-white flex items-center justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 max-w-md"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Inbox className="h-4 w-4 mr-1" /> Primary
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No emails found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    There are no emails in this folder or matching your search.
                  </p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <EmailItem 
                    key={email.id} 
                    email={email} 
                    onToggleRead={handleToggleRead}
                    onToggleStar={handleToggleStar}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Email;
