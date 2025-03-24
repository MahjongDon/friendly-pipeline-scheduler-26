
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Task } from "@/types/task";

interface TaskFormProps {
  task?: Task | null;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  formTitle: string;
  submitButtonText: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  selectedDate,
  setSelectedDate,
  onSubmit,
  formTitle,
  submitButtonText
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor={task ? "edit-task-title" : "task-title"}>
            Task Title
          </Label>
          <Input
            id={task ? "edit-task-title" : "task-title"}
            defaultValue={task?.title || ""}
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={task ? "edit-task-description" : "task-description"}>
            Description
          </Label>
          <Textarea
            id={task ? "edit-task-description" : "task-description"}
            defaultValue={task?.description || ""}
            placeholder="Add details about this task..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={task ? "edit-category" : "category"}>
            Category
          </Label>
          <Select defaultValue={task?.category || ""}>
            <SelectTrigger id={task ? "edit-category" : "category"}>
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
          <Label htmlFor={task ? "edit-priority" : "priority"}>
            Priority
          </Label>
          <Select defaultValue={task?.priority || "medium"}>
            <SelectTrigger id={task ? "edit-priority" : "priority"}>
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
      <div className="flex justify-end">
        <Button type="submit">{submitButtonText}</Button>
      </div>
    </form>
  );
};

export default TaskForm;
