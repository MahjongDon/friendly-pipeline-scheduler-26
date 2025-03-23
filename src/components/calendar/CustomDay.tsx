
import React from "react";
import { cn } from "@/lib/utils";
import { Event } from "./types";
import type { DayContentProps } from "react-day-picker";

interface CustomDayProps {
  dayProps: DayContentProps;
  events: Event[];
}

const CustomDay: React.FC<CustomDayProps> = ({ dayProps, events }) => {
  const { date, displayMonth, activeModifiers, ...rest } = dayProps;
  
  const eventsOnDay = events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );

  const maxEventsToShow = 3;
  const hasMoreEvents = eventsOnDay.length > maxEventsToShow;

  return (
    <div className={cn("h-12 w-12 p-0 font-normal aria-selected:opacity-100")}>
      <div className="w-full h-full">
        <div className="text-center">{date.getDate()}</div>
        {eventsOnDay.length > 0 && (
          <div className="mt-1 space-y-1">
            {eventsOnDay.slice(0, maxEventsToShow).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "w-full h-1.5 rounded-sm",
                  event.color || "bg-primary"
                )}
              />
            ))}
            {hasMoreEvents && (
              <div className="text-xs text-center text-muted-foreground">
                +{eventsOnDay.length - maxEventsToShow} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDay;
