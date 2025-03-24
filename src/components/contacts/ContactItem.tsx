
import React from "react";
import { Mail, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Contact } from "@/types/contact";

interface ContactItemProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onEdit, onDelete }) => {
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
              onClick={() => onDelete(contact.id)}
            >
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ContactItem;
