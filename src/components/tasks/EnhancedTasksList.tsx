
import React, { useState } from "react";
import { List, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDetail from "./TaskDetail";
import { Task } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { toast } from "sonner";

interface EnhancedTasksListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const EnhancedTasksList: React.FC<EnhancedTasksListProps> = ({ tasks, setTasks }) => {
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  
  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    toast.success("Task status updated");
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };
  
  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditDueDate(task.dueDate);
    setIsEditTaskOpen(true);
  };
  
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTask) return;
    
    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('#edit-task-title') as HTMLInputElement).value;
    const description = (form.querySelector('#edit-task-description') as HTMLTextAreaElement)?.value || "";
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
  
  return (
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

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskDetail
            key={task.id}
            task={task}
            onCompleteTask={handleCompleteTask}
            onEditClick={handleEditClick}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
      
      {selectedTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to your task details.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              task={selectedTask}
              selectedDate={editDueDate}
              setSelectedDate={setEditDueDate}
              onSubmit={handleEditTask}
              formTitle="Edit Task"
              submitButtonText="Save Changes"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedTasksList;
