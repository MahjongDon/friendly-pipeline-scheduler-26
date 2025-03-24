
import React, { useState } from "react";
import { PlusCircle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import ContactsList from "@/components/contacts/ContactsList";
import FilterDialog from "@/components/contacts/FilterDialog";
import ContactForm from "@/components/contacts/ContactForm";
import { Contact } from "@/types/contact";
import { sampleContacts } from "@/data/sampleContacts";

const Contacts: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  
  // Dialog states
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>(undefined);

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully");
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsAddContactDialogOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(c => c.id !== id));
    toast.success("Contact deleted successfully");
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
          
          <ContactsList 
            contacts={contacts}
            searchQuery={searchQuery}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />
          
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
