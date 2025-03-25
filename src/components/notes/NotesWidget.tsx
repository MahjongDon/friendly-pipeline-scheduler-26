
import React from "react";
import { StickyNote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/types/note";
import { format } from "date-fns";

interface NotesWidgetProps {
  notes: Note[];
  onAddNote?: () => void;
  onNoteClick?: (noteId: string) => void;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ 
  notes,
  onAddNote,
  onNoteClick 
}) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Function to truncate content if it's too long
  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Notes</CardTitle>
        <Button size="sm" onClick={onAddNote}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onNoteClick?.(note.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{note.title}</h3>
                <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{truncateContent(note.content)}</p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center">
                      <StickyNote className="h-2.5 w-2.5 mr-1" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>No notes yet. Click "Add" to create one.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesWidget;
