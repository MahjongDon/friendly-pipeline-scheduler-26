
export interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  category?: string;
  color?: string;
}

// Sample data
export const sampleEvents: Event[] = [
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
