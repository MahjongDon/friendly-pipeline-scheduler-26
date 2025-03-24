
import React from "react";
import { Mail, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/types/contact";

interface ContactsWidgetProps {
  contacts: Contact[];
  onAddContact?: () => void;
  onContactClick?: (contactId: string) => void;
}

const ContactsWidget: React.FC<ContactsWidgetProps> = ({ 
  contacts,
  onAddContact,
  onContactClick 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "lead":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Contacts</CardTitle>
        <Button size="sm" onClick={onAddContact}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onContactClick?.(contact.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                  {getInitials(contact.name)}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(contact.status)}`} />
                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsWidget;
