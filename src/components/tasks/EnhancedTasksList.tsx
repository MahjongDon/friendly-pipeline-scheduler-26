
import React, { useState } from "react";
import TaskDetail from "./TaskDetail";
import { Task } from "@/types/task";
import { toast } from "sonner";
import TaskActions from "./TaskActions";
import TaskEditDialog from "./TaskEditDialog";

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
      <TaskActions />

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
      
      <TaskEditDialog
        isOpen={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        selectedTask={selectedTask}
        editDueDate={editDueDate}
        setEditDueDate={setEditDueDate}
        onSubmit={handleEditTask}
      />
    </div>
  );
};

export default EnhancedTasksList;
