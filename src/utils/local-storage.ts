
import { Note } from "@/types/note";
import { v4 as uuidv4 } from 'uuid';

// Keys for storing data in localStorage
const NOTES_STORAGE_KEY = 'app_demo_notes';

// Helper to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Get all notes from localStorage
export const getNotesFromLocalStorage = (): Note[] => {
  try {
    const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return [];
  }
};

// Save all notes to localStorage
export const saveNotesToLocalStorage = (notes: Note[]) => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

// Add a new note to localStorage
export const addNoteToLocalStorage = (noteData: { 
  title: string; 
  content: string; 
  tags?: string[];
}): Note => {
  const notes = getNotesFromLocalStorage();
  
  const newNote: Note = {
    id: uuidv4(),
    title: noteData.title,
    content: noteData.content,
    tags: noteData.tags || [],
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
    user_id: 'demo-user'
  };
  
  notes.push(newNote);
  saveNotesToLocalStorage(notes);
  
  return newNote;
};

// Update an existing note in localStorage
export const updateNoteInLocalStorage = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getNotesFromLocalStorage();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updated_at: getCurrentTimestamp()
  };
  
  notes[noteIndex] = updatedNote;
  saveNotesToLocalStorage(notes);
  
  return updatedNote;
};

// Delete a note from localStorage
export const deleteNoteFromLocalStorage = (id: string): boolean => {
  const notes = getNotesFromLocalStorage();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) return false;
  
  saveNotesToLocalStorage(filteredNotes);
  return true;
};
