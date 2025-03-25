
import React from "react";
import { Calendar, CalendarPlus, Clock } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Updated to allow string dates for the dashboard
interface Event {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  date?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  organizer?: string;
}

interface CalendarWidgetProps {
  events: Event[];
  onAddEvent?: () => void;
  onEventClick?: (eventId: string) => void;
  days?: number;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  events,
  onAddEvent,
  onEventClick,
  days = 7
}) => {
  const today = new Date();
  const endDate = addDays(today, days - 1);
  
  // Filter events that occur within the specified range
  const filteredEvents = events.filter(event => {
    // Handle different date formats
    const eventDate = event.date 
      ? new Date(event.date) 
      : typeof event.start === 'string' 
        ? new Date(event.start) 
        : event.start;
    
    return eventDate >= today && eventDate <= endDate;
  });
  
  // Group events by day
  const groupedEvents: { [key: string]: Event[] } = {};
  
  filteredEvents.forEach(event => {
    // Handle different date formats
    const eventDate = event.date 
      ? new Date(event.date) 
      : typeof event.start === 'string'
        ? new Date(event.start)
        : event.start;
    
    const dateKey = format(eventDate, "yyyy-MM-dd");
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });
  
  // Generate dates for the specified range
  const dateRange: Date[] = [];
  for (let i = 0; i < days; i++) {
    dateRange.push(addDays(today, i));
  }

  const getTimeString = (date: Date | string) => {
    return format(typeof date === 'string' ? new Date(date) : date, "h:mm a");
  };

  const getDayTitle = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE");
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Events</CardTitle>
        <Button size="sm" onClick={onAddEvent}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dateRange.map(date => {
            const dateKey = format(date, "yyyy-MM-dd");
            const dayEvents = groupedEvents[dateKey] || [];
            
            return (
              <div key={dateKey} className="pb-3 last:pb-0">
                <div className="flex items-center mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full mr-2 flex items-center justify-center text-xs font-medium",
                    isToday(date) ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {format(date, "d")}
                  </div>
                  <span className="font-medium">{getDayTitle(date)}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {format(date, "MMM d")}
                  </span>
                </div>
                
                {dayEvents.length === 0 ? (
                  <div className="pl-10 text-sm text-muted-foreground">
                    No events scheduled
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="ml-10 pl-3 border-l-2 border-primary/30 hover:border-primary cursor-pointer transition-colors"
                        onClick={() => onEventClick?.(event.id)}
                      >
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.allDay 
                            ? "All day" 
                            : `${getTimeString(event.start)} - ${getTimeString(event.end)}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
