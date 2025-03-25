
import React, { useState } from "react";
import { PlusCircle, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import NotesList from "@/components/notes/NotesList";
import NoteForm from "@/components/notes/NoteForm";
import { Note } from "@/types/note";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Notes: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch notes from Supabase
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(`Error fetching notes: ${error.message}`);
        return [];
      }
      
      return data as Note[];
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          ...newNote, 
          user_id: 'anonymous',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: any) => {
      toast.error(`Error adding note: ${error.message}`);
    }
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updatedNote,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedNote.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating note: ${error.message}`);
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting note: ${error.message}`);
    }
  });

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsAddNoteOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  const handleNoteFormClose = (open: boolean) => {
    setIsAddNoteOpen(open);
    if (!open) {
      setTimeout(() => setCurrentNote(undefined), 300);
    }
  };

  const handleSaveNote = (formData: { title: string; content: string; tags?: string[] }) => {
    if (currentNote) {
      // Update existing note
      updateNoteMutation.mutate({ 
        id: currentNote.id, 
        ...formData 
      });
    } else {
      // Add new note
      addNoteMutation.mutate({
        title: formData.title,
        content: formData.content,
        tags: formData.tags || [],
        user_id: 'anonymous'
      });
    }
    setIsAddNoteOpen(false);
    // Reset current note after a short delay
    setTimeout(() => setCurrentNote(undefined), 300);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <h1 className="text-2xl font-semibold mb-1">Notes</h1>
              <p className="text-muted-foreground">Manage your notes and ideas</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                size="sm"
                onClick={() => {
                  setCurrentNote(undefined);
                  setIsAddNoteOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Note
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="tagged">Tagged</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {isLoading ? (
                <div className="bg-white border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              ) : (
                <NotesList 
                  notes={filteredNotes} 
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              {isLoading ? (
                <div className="bg-white border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              ) : (
                <NotesList 
                  notes={filteredNotes.slice(0, 5)} 
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </TabsContent>
            
            <TabsContent value="tagged" className="mt-4">
              {isLoading ? (
                <div className="bg-white border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.from(new Set(notes.flatMap(note => note.tags || []))).map(tag => (
                      <Button 
                        key={tag} 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSearchQuery(tag)}
                        className="flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </Button>
                    ))}
                  </div>
                  <NotesList 
                    notes={filteredNotes.filter(note => note.tags && note.tags.length > 0)} 
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <NoteForm
            isOpen={isAddNoteOpen}
            onOpenChange={handleNoteFormClose}
            initialData={currentNote}
            onSave={handleSaveNote}
          />
        </main>
      </div>
    </div>
  );
};

export default Notes;
