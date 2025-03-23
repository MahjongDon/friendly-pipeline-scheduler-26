
import React, { useState } from "react";
import { PlusCircle, Filter, Search, Mail, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
  lastContact?: string;
  tags: string[];
}

// Sample data
const sampleContacts: Contact[] = [
  {
    id: "contact-1",
    name: "John Smith",
    company: "Acme Corp",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastContact: "2023-12-02",
    tags: ["client", "tech"],
  },
  {
    id: "contact-2",
    name: "Sarah Johnson",
    company: "Globex",
    email: "sarah.j@globex.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    lastContact: "2023-12-05",
    tags: ["prospect", "healthcare"],
  },
  {
    id: "contact-3",
    name: "Michael Brown",
    company: "Wayne Enterprises",
    email: "m.brown@wayne.com",
    phone: "+1 (555) 456-7890",
    status: "lead",
    tags: ["lead", "finance"],
  },
  {
    id: "contact-4",
    name: "Jessica Lee",
    company: "Stark Industries",
    email: "jessica@stark.com",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    lastContact: "2023-11-15",
    tags: ["previous-client", "manufacturing"],
  },
  {
    id: "contact-5",
    name: "Robert Chen",
    company: "Oscorp",
    email: "robert.chen@oscorp.com",
    phone: "+1 (555) 876-5432",
    status: "active",
    lastContact: "2023-12-01",
    tags: ["client", "biotech"],
  },
];

const ContactItem: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-md border hover:shadow-subtle transition-all duration-200">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
        {contact.name.split(" ").map(name => name[0]).join("")}
      </div>
      
      <div className="ml-4 flex-1">
        <h4 className="font-medium">{contact.name}</h4>
        <p className="text-sm text-muted-foreground">{contact.company}</p>
      </div>
      
      <div className="hidden md:block flex-1">
        <p className="text-sm">{contact.email}</p>
        <p className="text-sm text-muted-foreground">{contact.phone}</p>
      </div>
      
      <div className="hidden lg:block flex-1">
        <Badge 
          variant={
            contact.status === "active" ? "default" : 
            contact.status === "inactive" ? "outline" : "secondary"
          }
          className="text-xs"
        >
          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {contact.lastContact ? `Last contact: ${new Date(contact.lastContact).toLocaleDateString()}` : "New contact"}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Phone className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit contact</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
            <DropdownMenuItem>Add to campaign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const Contacts: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const filteredContacts = sampleContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Contacts</h1>
              <p className="text-muted-foreground">Manage your contacts and leads</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "active")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="leads" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "lead")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "inactive")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Contacts;
