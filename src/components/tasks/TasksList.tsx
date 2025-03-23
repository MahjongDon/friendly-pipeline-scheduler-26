
import React, { useState } from "react";
import { 
  CheckCircle, 
  Circle, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Flag,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  category?: string;
}

// Sample data
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Review website proposal",
    completed: false,
    dueDate: "2023-12-10",
    priority: "high",
    category: "Marketing",
  },
  {
    id: "task-2",
    title: "Send follow-up email to client",
    completed: false,
    dueDate: "2023-12-11",
    priority: "medium",
    category: "Sales",
  },
  {
    id: "task-3",
    title: "Prepare quarterly report",
    completed: false,
    dueDate: "2023-12-15",
    priority: "high",
    category: "Finance",
  },
  {
    id: "task-4",
    title: "Schedule team meeting",
    completed: true,
    dueDate: "2023-12-05",
    priority: "low",
    category: "Admin",
  },
  {
    id: "task-5",
    title: "Research competitor pricing",
    completed: false,
    dueDate: "2023-12-12",
    priority: "medium",
    category: "Strategy",
  },
];

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "high":
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    case "medium":
      return <Minus className="h-4 w-4 text-amber-500" />;
    case "low":
      return <ArrowDown className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const TaskItem: React.FC<{
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div 
      className={cn(
        "flex items-center p-3 bg-white rounded-md border hover:shadow-subtle transition-all duration-200",
        task.completed && "bg-muted/30"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onToggleComplete(task.id)}
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      
      <div className="ml-2 flex-1">
        <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        
        <div className="flex items-center gap-2 mt-1">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
          
          {task.category && (
            <Badge variant="outline" className="text-xs font-normal">
              {task.category}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center ml-2">
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs h-6 px-2",
            task.priority === "high" && "task-priority-high",
            task.priority === "medium" && "task-priority-medium",
            task.priority === "low" && "task-priority-low"
          )}
        >
          <PriorityIcon priority={task.priority} />
          <span className="ml-1 capitalize">{task.priority}</span>
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" /> Edit task
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" /> Change priority
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        completed: false,
        priority: "medium",
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
    }
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" className="shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </form>

      <div className="space-y-3">
        {pendingTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center mt-6 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-sm text-muted-foreground"
            >
              {showCompleted ? "Hide" : "Show"} completed tasks ({completedTasks.length})
            </Button>
          </div>

          {showCompleted && (
            <div className="space-y-3 opacity-70">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksList;
