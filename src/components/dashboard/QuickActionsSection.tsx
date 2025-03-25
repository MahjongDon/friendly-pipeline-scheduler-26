
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileEdit, UserPlus, CalendarPlus, Mail } from "lucide-react";
import QuickActionButton from "./QuickActionButton";

const QuickActionsSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <QuickActionButton 
        icon={FileEdit} 
        label="New Task" 
        onClick={() => navigate('/tasks?action=new')}
      />
      <QuickActionButton 
        icon={UserPlus} 
        label="New Contact" 
        onClick={() => navigate('/contacts?action=new')}
      />
      <QuickActionButton 
        icon={CalendarPlus} 
        label="New Event" 
        onClick={() => navigate('/calendar?action=new')}
      />
      <QuickActionButton 
        icon={Mail} 
        label="New Email" 
        onClick={() => alert('Email feature coming soon!')}
      />
    </div>
  );
};

export default QuickActionsSection;
