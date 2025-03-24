
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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const ContactItem: React.FC<{ contact: Contact; onEdit: (contact: Contact) => void }> = ({ contact, onEdit }) => {
  const handleEmailClick = () => {
    window.open(`mailto:${contact.email}`);
    toast.success(`Composing email to ${contact.name}`);
  };

  const handlePhoneClick = () => {
    window.open(`tel:${contact.phone}`);
    toast.success(`Calling ${contact.name}`);
  };

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
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEmailClick}>
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePhoneClick}>
          <Phone className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => toast.success(`Viewing ${contact.name}'s profile`)}>
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(contact)}>
              Edit contact
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success(`Added note to ${contact.name}`)}>
              Add note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success(`Added ${contact.name} to campaign`)}>
              Add to campaign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => toast.success(`Deleted ${contact.name} from contacts`)}
            >
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const FilterDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: () => void;
}> = ({ isOpen, onOpenChange, onApplyFilters }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Contacts</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down your contact list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="all">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tag">Tag</Label>
            <Select defaultValue="all">
              <SelectTrigger id="tag">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Select defaultValue="all">
              <SelectTrigger id="company">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="acme">Acme Corp</SelectItem>
                <SelectItem value="globex">Globex</SelectItem>
                <SelectItem value="wayne">Wayne Enterprises</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            onApplyFilters();
            onOpenChange(false);
          }}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ContactForm: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Contact;
  onSave: (formData: Partial<Contact>) => void;
}> = ({ isOpen, onOpenChange, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<Contact>>(initialData || {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'lead',
    tags: []
  });

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update contact information' : 'Enter details for the new contact'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name || ''} 
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={formData.company || ''} 
                onChange={(e) => handleChange('company', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email || ''} 
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={formData.phone || ''} 
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value as 'active' | 'inactive' | 'lead')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Save Changes' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Contacts: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  
  // Dialog states
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>(undefined);
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully");
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsAddContactDialogOpen(true);
  };

  const handleSaveContact = (formData: Partial<Contact>) => {
    if (currentContact) {
      // Update existing contact
      setContacts(contacts.map(c => 
        c.id === currentContact.id ? { ...c, ...formData } as Contact : c
      ));
      toast.success(`Contact ${formData.name} updated successfully`);
    } else {
      // Add new contact
      const newContact: Contact = {
        id: `contact-${Date.now()}`,
        name: formData.name || '',
        company: formData.company || '',
        email: formData.email || '',
        phone: formData.phone || '',
        status: formData.status || 'lead',
        tags: formData.tags || [],
      };
      setContacts([...contacts, newContact]);
      toast.success(`Contact ${formData.name} added successfully`);
    }
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
              <h1 className="text-2xl font-semibold mb-1">Contacts</h1>
              <p className="text-muted-foreground">Manage your contacts and leads</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setCurrentContact(undefined);
                  setIsAddContactDialogOpen(true);
                }}
              >
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
                  <ContactItem key={contact.id} contact={contact} onEdit={handleEditContact} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "active")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} onEdit={handleEditContact} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="leads" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "lead")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} onEdit={handleEditContact} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <div className="space-y-3">
                {filteredContacts
                  .filter((contact) => contact.status === "inactive")
                  .map((contact) => (
                    <ContactItem key={contact.id} contact={contact} onEdit={handleEditContact} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <FilterDialog 
            isOpen={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
            onApplyFilters={handleApplyFilters}
          />
          
          <ContactForm
            isOpen={isAddContactDialogOpen}
            onOpenChange={setIsAddContactDialogOpen}
            initialData={currentContact}
            onSave={handleSaveContact}
          />
        </main>
      </div>
    </div>
  );
};

export default Contacts;
