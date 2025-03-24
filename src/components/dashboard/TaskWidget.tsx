
import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskWidgetProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
}

const TaskWidget: React.FC<TaskWidgetProps> = ({ 
  tasks, 
  onComplete, 
  onViewDetails 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-rose-500 bg-rose-50";
      case "medium":
        return "text-amber-500 bg-amber-50";
      case "low":
        return "text-blue-500 bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const isOverdue = (date: Date) => {
    return new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Priority Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
            <p>No priority tasks at the moment</p>
            <p className="text-sm">Enjoy your day!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => onViewDetails?.(task.id)}
                  >
                    {task.title}
                  </h3>
                  <div 
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className={cn(
                      isOverdue(task.dueDate) ? "text-rose-500" : ""
                    )}>
                      {isOverdue(task.dueDate) ? "Overdue: " : ""}
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => onComplete?.(task.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskWidget;
