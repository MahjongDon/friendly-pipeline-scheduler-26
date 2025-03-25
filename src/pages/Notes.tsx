
import React, { useState, useCallback } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotesList from "@/components/notes/NotesList";
import NoteForm from "@/components/notes/NoteForm";
import { Note } from "@/types/note";
import { NotesService } from "@/services/notes-service";

const Notes: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => NotesService.getNotes(),
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (noteData: { title: string; content: string; tags?: string[] }) => 
      NotesService.addNote(noteData),
    onSuccess: () => {
      toast.success("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardNotes'] });
    },
    onError: (error: any) => {
      toast.error(`Error adding note: ${error.message}`);
    }
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Note> }) => 
      NotesService.updateNote(id, updates),
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardNotes'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating note: ${error.message}`);
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => NotesService.deleteNote(id),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardNotes'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting note: ${error.message}`);
    }
  });

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSaveNote = useCallback((formData: { title: string; content: string; tags?: string[] }) => {
    if (currentNote) {
      // Update existing note
      updateNoteMutation.mutate({ 
        id: currentNote.id, 
        updates: formData 
      });
    } else {
      // Add new note
      addNoteMutation.mutate(formData);
    }
    setIsNoteFormOpen(false);
    setCurrentNote(undefined);
  }, [currentNote, updateNoteMutation, addNoteMutation]);

  const handleEditNote = useCallback((note: Note) => {
    setCurrentNote(note);
    setIsNoteFormOpen(true);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    deleteNoteMutation.mutate(id);
  }, [deleteNoteMutation]);

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
                  setIsNoteFormOpen(true);
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
          
          <NoteForm
            isOpen={isNoteFormOpen}
            onOpenChange={setIsNoteFormOpen}
            initialData={currentNote}
            onSave={handleSaveNote}
          />
        </main>
      </div>
    </div>
  );
};

export default Notes;
