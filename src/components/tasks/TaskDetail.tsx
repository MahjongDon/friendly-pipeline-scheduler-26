
import React from "react";
import { Check, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TaskDetailProps {
  task: Task;
  onCompleteTask: (taskId: string) => void;
  onEditClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  onCompleteTask,
  onEditClick,
  onDeleteTask
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-md bg-white flex items-start gap-3 group hover:shadow-subtle transition-all",
        task.completed && "bg-muted/50"
      )}
    >
      <Button 
        variant="outline" 
        size="icon" 
        className={cn("h-5 w-5 rounded-full", 
          task.completed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/20"
        )}
        onClick={() => onCompleteTask(task.id)}
      >
        {task.completed && <Check className="h-3 w-3" />}
      </Button>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
            {task.title}
          </h4>
          <Badge 
            variant="secondary"
            className={cn("text-xs", getPriorityColor(task.priority))}
          >
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">{task.category}</Badge>
          <span className="text-xs text-muted-foreground">
            Due: {format(task.dueDate, "MMM dd, yyyy")}
          </span>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditClick(task)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCompleteTask(task.id)}>
              <Check className="h-4 w-4 mr-2" /> 
              {task.completed ? "Mark as incomplete" : "Mark as complete"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskDetail;
