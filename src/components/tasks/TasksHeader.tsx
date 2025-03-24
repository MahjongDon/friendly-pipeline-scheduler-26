
import React from "react";
import { PlusCircle, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TasksHeaderProps {
  onNewTask: () => void;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ onNewTask }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Tasks</h1>
        <p className="text-muted-foreground">Manage and organize your tasks</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
        </Button>
        <Button size="sm" onClick={onNewTask}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;
