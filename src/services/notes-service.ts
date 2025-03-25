
import { Note } from "@/types/note";
import { getNotesFromLocalStorage, addNoteToLocalStorage, updateNoteInLocalStorage, deleteNoteFromLocalStorage } from "@/utils/local-storage";
import { toast } from "sonner";

export const NotesService = {
  // Get all notes from localStorage
  async getNotes(): Promise<Note[]> {
    try {
      return getNotesFromLocalStorage();
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error loading notes');
      return [];
    }
  },

  // Add a new note to localStorage
  async addNote(noteData: { title: string; content: string; tags?: string[] }): Promise<Note | null> {
    try {
      const newNote = addNoteToLocalStorage(noteData);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to save note');
      return null;
    }
  },

  // Update an existing note in localStorage
  async updateNote(
    id: string, 
    updates: { title?: string; content?: string; tags?: string[] }
  ): Promise<Note | null> {
    try {
      const updatedNote = updateNoteInLocalStorage(id, updates);
      if (!updatedNote) {
        toast.error('Note not found');
        return null;
      }
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      return null;
    }
  },

  // Delete a note from localStorage
  async deleteNote(id: string): Promise<boolean> {
    try {
      const result = deleteNoteFromLocalStorage(id);
      if (!result) {
        toast.error('Note not found');
      }
      return result;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }
};
