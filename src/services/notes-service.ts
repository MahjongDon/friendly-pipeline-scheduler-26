
import { Note } from "@/types/note";
import { supabase } from "@/integrations/supabase/client";
import { 
  getNotesFromLocalStorage, 
  addNoteToLocalStorage, 
  updateNoteInLocalStorage, 
  deleteNoteFromLocalStorage 
} from "@/utils/local-storage";
import { toast } from "sonner";

const NOTES_TABLE = 'notes';
const FALLBACK_TABLE = 'contact_notes'; // Fallback to this table if notes table doesn't exist

// Helper to determine if a Supabase error indicates a missing table
const isTableNotFoundError = (error: any): boolean => {
  return error?.message?.includes('does not exist') || 
         error?.message?.includes('relation') || 
         error?.code === '42P01';
};

export const NotesService = {
  // Get all notes, falling back to localStorage if needed
  async getNotes(isDemoMode: boolean = false): Promise<Note[]> {
    if (isDemoMode) {
      return getNotesFromLocalStorage();
    }

    try {
      // Try to get notes from the primary table
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (isTableNotFoundError(error)) {
          console.warn(`Notes table not found. Using fallback method.`);
          // If table doesn't exist, try the fallback table
          try {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from(FALLBACK_TABLE)
              .select('*')
              .order('created_at', { ascending: false });

            if (fallbackError) {
              throw fallbackError;
            }

            // Map fallback data to Note format if needed
            return fallbackData.map((item: any) => ({
              id: item.id,
              title: item.title || 'Note',
              content: item.text || item.content || '',
              tags: item.tags || [],
              created_at: item.created_at,
              updated_at: item.updated_at || item.created_at,
              user_id: item.user_id
            })) as Note[];
          } catch (fallbackError) {
            console.error('Fallback table failed too:', fallbackError);
            // If both tables fail, fall back to localStorage
            toast.error('Unable to connect to database, using local storage instead');
            return getNotesFromLocalStorage();
          }
        } else {
          // For other errors, fall back to localStorage
          console.error('Error fetching notes:', error);
          toast.error('Error loading notes, using local storage instead');
          return getNotesFromLocalStorage();
        }
      }

      return data as Note[];
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred, using local storage');
      return getNotesFromLocalStorage();
    }
  },

  // Add a new note
  async addNote(
    noteData: { title: string; content: string; tags?: string[] },
    isDemoMode: boolean = false
  ): Promise<Note | null> {
    if (isDemoMode) {
      const newNote = addNoteToLocalStorage(noteData);
      return newNote;
    }

    try {
      const timestamp = new Date().toISOString();
      const newNote = {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        user_id: 'anonymous', // Anonymous user ID for demo
        created_at: timestamp,
        updated_at: timestamp
      };

      // Try to add to the primary table
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .insert([newNote])
        .select()
        .single();

      if (error) {
        if (isTableNotFoundError(error)) {
          // Fall back to localStorage
          console.warn('Notes table not found, saving to localStorage');
          toast.info('Using local storage for saving notes');
          return addNoteToLocalStorage(noteData);
        } else {
          throw error;
        }
      }

      return data as Note;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to save note to database, using local storage');
      
      // Fall back to localStorage
      return addNoteToLocalStorage(noteData);
    }
  },

  // Update an existing note
  async updateNote(
    id: string, 
    updates: { title?: string; content?: string; tags?: string[] },
    isDemoMode: boolean = false
  ): Promise<Note | null> {
    if (isDemoMode) {
      return updateNoteInLocalStorage(id, updates);
    }

    try {
      const { data, error } = await supabase
        .from(NOTES_TABLE)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (isTableNotFoundError(error)) {
          console.warn('Notes table not found, updating in localStorage');
          toast.info('Using local storage for updating note');
          return updateNoteInLocalStorage(id, updates);
        } else {
          throw error;
        }
      }

      return data as Note;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note in database, using local storage');
      
      // Fall back to localStorage
      return updateNoteInLocalStorage(id, updates);
    }
  },

  // Delete a note
  async deleteNote(id: string, isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      return deleteNoteFromLocalStorage(id);
    }

    try {
      const { error } = await supabase
        .from(NOTES_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        if (isTableNotFoundError(error)) {
          console.warn('Notes table not found, deleting from localStorage');
          toast.info('Using local storage for deleting note');
          return deleteNoteFromLocalStorage(id);
        } else {
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note from database, using local storage');
      
      // Fall back to localStorage
      return deleteNoteFromLocalStorage(id);
    }
  }
};
