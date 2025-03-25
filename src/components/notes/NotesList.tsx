
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Tag } from "lucide-react";
import { Note } from "@/types/note";
import { format } from "date-fns";

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEditNote, onDeleteNote }) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No notes found. Create a new note to get started.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Function to truncate content if it's too long
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{note.title}</CardTitle>
            <CardDescription>
              {formatDate(note.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="whitespace-pre-line">{truncateContent(note.content)}</p>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditNote(note)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={() => onDeleteNote(note.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
