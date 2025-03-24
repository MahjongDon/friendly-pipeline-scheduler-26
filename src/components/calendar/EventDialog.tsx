
import React, { useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "./types";
import { toast } from "sonner";

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  onSave: (event: Omit<Event, "id">) => void;
  editingEvent?: Event;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedDate,
  onSave,
  editingEvent
}) => {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [eventDate, setEventDate] = useState<Date | undefined>(
    editingEvent?.date || selectedDate
  );
  const [time, setTime] = useState(editingEvent?.time || "10:00 AM");
  const [category, setCategory] = useState(editingEvent?.category || "Meeting");

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Meeting": return "bg-blue-500";
      case "Deadline": return "bg-red-500";
      case "Social": return "bg-green-500";
      case "Sales": return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (!eventDate) {
      toast.error("Please select a date");
      return;
    }

    onSave({
      title,
      date: eventDate,
      time,
      category,
      color: getCategoryColor(category)
    });
    
    // Reset form
    setTitle("");
    setTime("10:00 AM");
    setCategory("Meeting");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            Fill in the details for your calendar event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-time">Time</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="event-time" className="flex-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => {
                      const hour = i;
                      const period = hour >= 12 ? "PM" : "AM";
                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                      
                      return (
                        <React.Fragment key={hour}>
                          <SelectItem value={`${displayHour}:00 ${period}`}>
                            {`${displayHour}:00 ${period}`}
                          </SelectItem>
                          <SelectItem value={`${displayHour}:30 ${period}`}>
                            {`${displayHour}:30 ${period}`}
                          </SelectItem>
                        </React.Fragment>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="event-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Deadline">Deadline</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingEvent ? "Update Event" : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
