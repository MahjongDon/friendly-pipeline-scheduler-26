
import React, { useState } from "react";
import { PlusCircle, Filter, Calendar as CalendarIcon, List, Users, ArrowUpDown, Check, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

// Sample task data
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Prepare client presentation",
    description: "Create slides for the quarterly business review",
    category: "work",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    completed: false,
    createdAt: new Date()
  },
  {
    id: "task-2",
    title: "Review marketing materials",
    description: "Check new brochure designs from the design team",
    category: "marketing",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "task-3",
    title: "Follow up with leads",
    description: "Contact prospects from the recent trade show",
    category: "sales",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: "task-4",
    title: "Update CRM data",
    description: "Clean up contact information in the system",
    category: "admin",
    priority: "low",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
  }
];

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  
  // Handler for marking a task as complete
  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    toast.success("Task status updated");
  };
  
  // Handler for deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };
  
  // Handler for opening edit dialog
  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditDueDate(task.dueDate);
    setIsEditTaskOpen(true);
  };
  
  // Handler for saving edited task
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTask) return;
    
    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('#edit-task-title') as HTMLInputElement).value;
    const description = (form.querySelector('#edit-task-description') as HTMLTextAreaElement).value;
    const category = (form.querySelector('#edit-category') as HTMLSelectElement).value;
    const priority = (form.querySelector('#edit-priority') as HTMLSelectElement).value as "high" | "medium" | "low";
    
    const updatedTask: Task = {
      ...selectedTask,
      title,
      description,
      category,
      priority,
      dueDate: editDueDate || new Date(),
    };
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));
    
    setIsEditTaskOpen(false);
    toast.success("Task updated successfully");
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id} 
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
            onClick={() => handleCompleteTask(task.id)}
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
                <DropdownMenuItem onClick={() => handleEditClick(task)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                  <Check className="h-4 w-4 mr-2" /> 
                  {task.completed ? "Mark as incomplete" : "Mark as complete"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      
      {/* Edit Task Dialog */}
      {selectedTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to your task details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditTask}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-title">
                    Task Title
                  </Label>
                  <Input
                    id="edit-task-title"
                    defaultValue={selectedTask.title}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-description">
                    Description
                  </Label>
                  <Textarea
                    id="edit-task-description"
                    defaultValue={selectedTask.description}
                    placeholder="Add details about this task..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">
                    Category
                  </Label>
                  <Select defaultValue={selectedTask.category}>
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">
                    Priority
                  </Label>
                  <Select defaultValue={selectedTask.priority}>
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDueDate ? format(editDueDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editDueDate}
                        onSelect={setEditDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const Tasks = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const isMobile = useIsMobile();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, we would add the task to our state here
    // and possibly send it to a backend
    
    setIsAddTaskOpen(false);
    toast.success("Task added successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
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
              <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> New Task
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
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
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="today" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
          </Tabs>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to keep track of your work.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">
                      Task Title
                    </Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">
                      Description
                    </Label>
                    <Textarea
                      id="task-description"
                      placeholder="Add details about this task..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">
                      Priority
                    </Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
