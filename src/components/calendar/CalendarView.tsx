
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DayProps } from "react-day-picker";

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  category?: string;
  color?: string;
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: "event-1",
    title: "Client Meeting",
    date: new Date(2023, 11, 10),
    time: "10:00 AM",
    category: "Meeting",
    color: "bg-blue-500",
  },
  {
    id: "event-2",
    title: "Project Deadline",
    date: new Date(2023, 11, 15),
    category: "Deadline",
    color: "bg-red-500",
  },
  {
    id: "event-3",
    title: "Team Lunch",
    date: new Date(2023, 11, 12),
    time: "12:30 PM",
    category: "Social",
    color: "bg-green-500",
  },
  {
    id: "event-4",
    title: "Marketing Call",
    date: new Date(2023, 11, 12),
    time: "3:00 PM",
    category: "Meeting",
    color: "bg-blue-500",
  },
  {
    id: "event-5",
    title: "Product Demo",
    date: new Date(2023, 11, 20),
    time: "11:00 AM",
    category: "Sales",
    color: "bg-purple-500",
  },
];

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const eventsForSelectedDate = sampleEvents.filter((event) => {
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

  // Custom day render to show events
  const renderDay = (day: Date) => {
    const eventsOnDay = sampleEvents.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );

    const maxEventsToShow = 3;
    const hasMoreEvents = eventsOnDay.length > maxEventsToShow;

    return (
      <div className="w-full h-full">
        <div className="text-center">{day.getDate()}</div>
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
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="w-full sm:w-auto">
        <div className="bg-white border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Calendar</h3>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setDate(newDate);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setDate(newDate);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={date}
            showOutsideDays
            className="p-0"
            components={{
              Day: ({ day, ...props }: DayProps) => (
                <button
                  {...props}
                  className={cn(
                    props.className,
                    "h-12 w-12 p-0 font-normal aria-selected:opacity-100"
                  )}
                >
                  {renderDay(day)}
                </button>
              ),
            }}
          />
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Upcoming Events</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>
          <div className="space-y-3">
            {sampleEvents.slice(0, 5).map((event) => (
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
      </div>

      <div className="flex-1 bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
            {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
          </h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="month" onValueChange={(val: "month" | "week" | "day") => setView(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>
        </div>

        {view === "day" && selectedDate && (
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
                        <div 
                          key={event.id} 
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
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {view !== "day" && (
          <div className="text-center py-10 text-muted-foreground">
            Daily view provides the most detailed event information.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => setView("day")}>
                Switch to Day View
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
