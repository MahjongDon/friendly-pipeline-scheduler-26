
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Event } from "./types";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div 
      className={cn(
        "p-2 rounded-md mb-2 text-white",
        event.color || "bg-primary"
      )}
    >
      <div className="font-medium">{event.title}</div>
      {event.category && (
        <Badge variant="outline" className="mt-1 text-xs font-normal bg-white/20 text-white border-white/30">
          {event.category}
        </Badge>
      )}
    </div>
  );
};

export default EventCard;
