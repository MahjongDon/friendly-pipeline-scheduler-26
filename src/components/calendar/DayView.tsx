
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Event } from "./types";
import EventCard from "./EventCard";

interface DayViewProps {
  selectedDate: Date | undefined;
  events: Event[];
  onSwitchView: (view: "day" | "week" | "month") => void;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  events,
  onSwitchView,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const eventsForSelectedDate = events.filter((event) => {
    if (!selectedDate) return false;
    return (
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  });

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`;
  });

  return (
    <div className="space-y-4">
      {eventsForSelectedDate.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p className="mb-4">No events scheduled for this day.</p>
          <Button onClick={onAddEvent}>
            <Plus className="h-4 w-4 mr-2" /> Add Event
          </Button>
        </div>
      ) : (
        timeSlots.map((timeSlot) => {
          const eventsAtTime = eventsForSelectedDate.filter(
            (event) => event.time && event.time.includes(timeSlot.split(" ")[0])
          );
          
          return (
            <div key={timeSlot} className="flex">
              <div className="w-20 text-sm text-muted-foreground py-2 shrink-0">
                {timeSlot}
              </div>
              <div className="flex-1 border-l pl-4">
                {eventsAtTime.length > 0 ? (
                  eventsAtTime.map((event) => (
                    <div key={event.id} className="mb-2 bg-white border rounded-md p-3 group hover:shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={cn("w-3 h-3 rounded-full mr-2", event.color || "bg-primary")}></div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => onEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive" 
                            onClick={() => onDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Badge className="mt-2" variant="outline">{event.category}</Badge>
                    </div>
                  ))
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground border border-dashed"
                    onClick={onAddEvent}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add event at {timeSlot}
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DayView;
