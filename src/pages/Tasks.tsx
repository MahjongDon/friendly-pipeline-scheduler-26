
import React, { useState } from "react";
import { initialTasks, Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import TasksHeader from "@/components/tasks/TasksHeader";
import EnhancedTasksList from "@/components/tasks/EnhancedTasksList";
import TaskForm from "@/components/tasks/TaskForm";

const Tasks = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const isMobile = useIsMobile();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('#task-title') as HTMLInputElement).value;
    const description = (form.querySelector('#task-description') as HTMLTextAreaElement)?.value || "";
    const category = (form.querySelector('#category') as HTMLSelectElement).value;
    const priority = (form.querySelector('#priority') as HTMLSelectElement).value as "high" | "medium" | "low";
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      category,
      priority,
      dueDate: selectedDate || new Date(),
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([newTask, ...tasks]);
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
          <TasksHeader onNewTask={() => setIsAddTaskOpen(true)} />
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <EnhancedTasksList tasks={tasks} setTasks={setTasks} />
            </TabsContent>
            
            <TabsContent value="today" className="mt-4">
              <EnhancedTasksList 
                tasks={tasks.filter(task => 
                  new Date(task.dueDate).toDateString() === new Date().toDateString()
                )} 
                setTasks={setTasks} 
              />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              <EnhancedTasksList 
                tasks={tasks.filter(task => 
                  new Date(task.dueDate) > new Date() && 
                  new Date(task.dueDate).toDateString() !== new Date().toDateString()
                )} 
                setTasks={setTasks} 
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <EnhancedTasksList 
                tasks={tasks.filter(task => task.completed)} 
                setTasks={setTasks} 
              />
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
              <TaskForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onSubmit={handleAddTask}
                formTitle="Add New Task"
                submitButtonText="Add Task"
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
