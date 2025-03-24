
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactItem from "./ContactItem";
import { Contact } from "@/types/contact";

interface ContactsListProps {
  contacts: Contact[];
  searchQuery: string;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  searchQuery,
  onEditContact,
  onDeleteContact
}) => {
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
            <ContactItem 
              key={contact.id} 
              contact={contact} 
              onEdit={onEditContact} 
              onDelete={onDeleteContact}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        <div className="space-y-3">
          {filteredContacts
            .filter((contact) => contact.status === "active")
            .map((contact) => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                onEdit={onEditContact} 
                onDelete={onDeleteContact}
              />
            ))}
        </div>
      </TabsContent>
      <TabsContent value="leads" className="mt-4">
        <div className="space-y-3">
          {filteredContacts
            .filter((contact) => contact.status === "lead")
            .map((contact) => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                onEdit={onEditContact} 
                onDelete={onDeleteContact}
              />
            ))}
        </div>
      </TabsContent>
      <TabsContent value="inactive" className="mt-4">
        <div className="space-y-3">
          {filteredContacts
            .filter((contact) => contact.status === "inactive")
            .map((contact) => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                onEdit={onEditContact} 
                onDelete={onDeleteContact}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContactsList;
