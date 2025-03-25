
import React from "react";
import { useNavigate } from "react-router-dom";
import TaskWidget from "./TaskWidget";
import NotesWidget from "@/components/notes/NotesWidget";
import ContactsWidget from "./ContactsWidget";
import { Task } from "@/types/task";
import { Note } from "@/types/note";
import { Contact } from "@/types/contact";

interface WidgetsSectionProps {
  tasks: Task[];
  notes: Note[];
  contacts: Contact[];
}

const WidgetsSection: React.FC<WidgetsSectionProps> = ({ tasks, notes, contacts }) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div className="col-span-1">
        <TaskWidget 
          tasks={tasks} 
          onComplete={(id) => console.log(`Complete task ${id}`)}
          onViewDetails={(id) => navigate(`/tasks?id=${id}`)}
        />
      </div>
      <div className="col-span-1">
        <NotesWidget 
          notes={notes} 
          onAddNote={() => navigate('/notes')}
          onNoteClick={(noteId) => navigate(`/notes?id=${noteId}`)}
        />
      </div>
      <div className="col-span-1">
        <ContactsWidget 
          contacts={contacts} 
          onAddContact={() => navigate('/contacts')}
          onContactClick={(contactId) => navigate(`/contacts?id=${contactId}`)}
        />
      </div>
    </div>
  );
};

export default WidgetsSection;
