
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Event } from "./types";

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Upcoming Events</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>
      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="flex items-start p-2 rounded-md hover:bg-muted/50">
            <div className={cn("w-3 h-3 rounded-full mt-1 mr-3", event.color || "bg-primary")} />
            <div className="flex-1">
              <p className="font-medium">{event.title}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>
                  {event.date.toLocaleDateString()} {event.time && `• ${event.time}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
