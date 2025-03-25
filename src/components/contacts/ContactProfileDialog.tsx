
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Building2, CalendarClock, Tag, Edit, Plus } from "lucide-react";
import { Contact } from "@/types/contact";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ContactNote {
  id: string;
  text: string;
  created_at: string;
  contact_id: string;
  user_id: string;
}

interface ContactProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onEdit: (contact: Contact) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const ContactProfileDialog: React.FC<ContactProfileDialogProps> = ({
  open,
  onOpenChange,
  contact,
  onEdit,
  activeTab = "details",
  setActiveTab
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);
  const [newNote, setNewNote] = useState("");
  const [campaign, setCampaign] = useState("");
  const queryClient = useQueryClient();
  
  // Fetch contact notes from Supabase
  const { data: notes = [] } = useQuery({
    queryKey: ['contactNotes', contact?.id],
    queryFn: async () => {
      if (!contact) return [];
      
      const { data, error } = await supabase
        .from('contact_notes')
        .select('*')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(`Error fetching notes: ${error.message}`);
        return [];
      }
      
      return data as ContactNote[];
    },
    enabled: !!contact && open,
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!contact) throw new Error("Missing contact");
      
      const { data, error } = await supabase
        .from('contact_notes')
        .insert([{
          contact_id: contact.id,
          user_id: 'anonymous', // Since we no longer have user auth
          text
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ['contactNotes', contact?.id] });
      setNewNote("");
    },
    onError: (error: any) => {
      toast.error(`Error adding note: ${error.message}`);
    }
  });

  // Reset state when dialog opens with a new contact or tab changes
  useEffect(() => {
    if (open && contact) {
      // Reset the new note input and campaign input when the dialog opens
      setNewNote("");
      setCampaign("");
    }

    // Set internal tab state based on prop
    if (activeTab) {
      setInternalActiveTab(activeTab);
    }
  }, [open, contact, activeTab]);

  // Clear state when dialog closes
  useEffect(() => {
    if (!open) {
      // Clean up any state that should be reset when the dialog closes
    }
  }, [open]);

  const handleAddNote = () => {
    if (!newNote.trim() || !contact) return;
    addNoteMutation.mutate(newNote);
  };

  const handleAddToCampaign = () => {
    if (!campaign.trim() || !contact) return;
    
    toast.success(`Added ${contact?.name} to campaign: ${campaign}`);
    setCampaign("");
  };
  
  const handleTabChange = (value: string) => {
    setInternalActiveTab(value);
    if (setActiveTab) {
      setActiveTab(value);
    }
  };

  const handleEditClick = () => {
    if (contact) {
      onEdit(contact);
      onOpenChange(false);
    }
  };

  // Safety check - don't render if contact is null
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xl flex-shrink-0 mr-4">
              {contact.name.split(" ").map(name => name[0]).join("")}
            </div>
            <DialogTitle className="text-2xl">{contact.name}</DialogTitle>
          </div>
          <div className="ml-16 -mt-1">
            <Badge 
              variant={
                contact.status === "active" ? "default" : 
                contact.status === "inactive" ? "outline" : "secondary"
              }
            >
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={internalActiveTab} onValueChange={handleTabChange} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{contact.company}</p>
                    </div>
                  </div>
                  
                  {contact.lastContact && (
                    <div className="flex items-center">
                      <CalendarClock className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Last Contact</p>
                        <p className="font-medium">{new Date(contact.lastContact).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.tags && contact.tags.length > 0 ? (
                          contact.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No tags</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardContent className="pt-4 space-y-4">
                {notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div key={note.id} className="border p-3 rounded-md">
                        <p>{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No notes yet. Add one below.</p>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="new-note">Add Note</Label>
                  <Textarea 
                    id="new-note" 
                    placeholder="Type your note here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign">Add to Campaign</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="campaign" 
                      placeholder="Campaign name"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddToCampaign}
                      disabled={!campaign.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactProfileDialog;
