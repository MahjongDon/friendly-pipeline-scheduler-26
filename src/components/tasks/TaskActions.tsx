
import React from "react";
import { List, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const TaskActions: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <Button variant="outline" size="sm" className="h-8">
          <List className="h-4 w-4 mr-2" /> List View
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <CalendarIcon className="h-4 w-4 mr-2" /> Calendar View
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="h-8">
          <Users className="h-4 w-4 mr-2" /> Assignee
        </Button>
      </div>
    </div>
  );
};

export default TaskActions;
