
import React from "react";
import { Task } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TaskForm from "./TaskForm";

interface TaskEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  editDueDate: Date | undefined;
  setEditDueDate: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedTask,
  editDueDate,
  setEditDueDate,
  onSubmit
}) => {
  if (!selectedTask) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          onSubmit={onSubmit}
          formTitle="Edit Task"
          submitButtonText="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
