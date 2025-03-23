
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Event } from "./types";
import EventCard from "./EventCard";

interface DayViewProps {
  selectedDate: Date | undefined;
  events: Event[];
  onSwitchView: (view: "day" | "week" | "month") => void;
}

const DayView: React.FC<DayViewProps> = ({ selectedDate, events, onSwitchView }) => {
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
          No events scheduled for this day.
        </div>
      ) : (
        timeSlots.map((timeSlot) => {
          const eventsAtTime = eventsForSelectedDate.filter(
            (event) => event.time && event.time.includes(timeSlot.split(" ")[0])
          );
          
          return (
            <div key={timeSlot} className="flex">
              <div className="w-20 text-sm text-muted-foreground py-2">
                {timeSlot}
              </div>
              <div className="flex-1 border-l pl-4">
                {eventsAtTime.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DayView;
