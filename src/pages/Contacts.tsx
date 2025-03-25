
import React, { useState, useCallback, useEffect } from "react";
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
import ContactProfileDialog from "@/components/contacts/ContactProfileDialog";
import { Contact } from "@/types/contact";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Contacts: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  // Dialog states
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>(undefined);
  const [activeProfileTab, setActiveProfileTab] = useState("details");

  // Fetch contacts from Supabase
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(`Error fetching contacts: ${error.message}`);
        return [];
      }
      
      return data as Contact[];
    },
  });

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (newContact: Omit<Contact, 'id'>) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ ...newContact, user_id: 'anonymous' }]) // Use 'anonymous' instead of user.id
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Contact added successfully");
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      toast.error(`Error adding contact: ${error.message}`);
    }
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (updatedContact: Contact) => {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          name: updatedContact.name,
          company: updatedContact.company,
          email: updatedContact.email,
          phone: updatedContact.phone,
          status: updatedContact.status,
          tags: updatedContact.tags,
        })
        .eq('id', updatedContact.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Contact updated successfully");
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating contact: ${error.message}`);
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Contact deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting contact: ${error.message}`);
    }
  });

  const handleApplyFilters = useCallback(() => {
    toast.success("Filters applied successfully");
  }, []);

  const handleEditContact = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setIsAddContactDialogOpen(true);
    setIsProfileDialogOpen(false);
  }, []);

  const handleDeleteContact = useCallback((id: string) => {
    deleteContactMutation.mutate(id);
  }, [deleteContactMutation]);

  const handleViewProfile = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setActiveProfileTab("details");
    setIsProfileDialogOpen(true);
  }, []);

  const handleAddNote = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setActiveProfileTab("notes");
    setIsProfileDialogOpen(true);
  }, []);

  const handleAddToCampaign = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setActiveProfileTab("campaigns");
    setIsProfileDialogOpen(true);
  }, []);

  const handleProfileDialogClose = useCallback((open: boolean) => {
    setIsProfileDialogOpen(open);
    if (!open) {
      // Small delay to ensure clean reset after animation
      setTimeout(() => {
        setCurrentContact(undefined);
        setActiveProfileTab("details");
      }, 300);
    }
  }, []);

  const handleContactFormClose = useCallback((open: boolean) => {
    setIsAddContactDialogOpen(open);
    if (!open) {
      setTimeout(() => setCurrentContact(undefined), 300);
    }
  }, []);

  const handleSaveContact = useCallback((formData: Partial<Contact>) => {
    if (currentContact) {
      // Update existing contact
      updateContactMutation.mutate({ 
        ...currentContact, 
        ...formData 
      } as Contact);
    } else {
      // Add new contact
      addContactMutation.mutate({
        name: formData.name || '',
        company: formData.company || '',
        email: formData.email || '',
        phone: formData.phone || '',
        status: formData.status || 'lead',
        tags: formData.tags || [],
      });
    }
    setIsAddContactDialogOpen(false);
    // Reset current contact after a short delay
    setTimeout(() => setCurrentContact(undefined), 300);
  }, [currentContact, updateContactMutation, addContactMutation]);

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
          
          {isLoading ? (
            <div className="bg-white border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : (
            <ContactsList 
              contacts={contacts}
              searchQuery={searchQuery}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
              onViewProfile={handleViewProfile}
              onAddNote={handleAddNote}
              onAddToCampaign={handleAddToCampaign}
            />
          )}
          
          <FilterDialog 
            isOpen={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
            onApplyFilters={handleApplyFilters}
          />
          
          <ContactForm
            isOpen={isAddContactDialogOpen}
            onOpenChange={handleContactFormClose}
            initialData={currentContact}
            onSave={handleSaveContact}
          />

          <ContactProfileDialog
            open={isProfileDialogOpen}
            onOpenChange={handleProfileDialogClose}
            contact={currentContact || null}
            onEdit={handleEditContact}
            activeTab={activeProfileTab}
            setActiveTab={setActiveProfileTab}
          />
        </main>
      </div>
    </div>
  );
};

export default Contacts;
