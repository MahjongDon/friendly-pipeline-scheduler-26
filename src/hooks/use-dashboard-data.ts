
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { Contact } from "@/types/contact";
import { NotesService } from "@/services/notes-service";
import { Note } from "@/types/note";

export interface DashboardEvent {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
}

export function useDashboardData() {
  // Fetch tasks
  const { data: recentTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      // Simulate fetching tasks from an API
      return [
        { 
          id: "1", 
          title: "Design CRM Dashboard", 
          completed: true, 
          category: "Design",
          priority: "high",
          dueDate: new Date("2024-03-14"),
          createdAt: new Date("2024-03-10"),
          description: "Complete the main dashboard layout for the CRM system"
        },
        { 
          id: "2", 
          title: "Conduct User Research", 
          completed: false, 
          category: "Research",
          priority: "medium",
          dueDate: new Date("2024-03-16"),
          createdAt: new Date("2024-03-12")
        },
        { 
          id: "3", 
          title: "Implement Authentication", 
          completed: false, 
          category: "Development",
          priority: "high",
          dueDate: new Date("2024-03-18"),
          createdAt: new Date("2024-03-13")
        },
      ];
    },
  });

  // Fetch contacts
  const { data: recentContacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<Contact[]> => {
      // Simulate fetching contacts from an API
      return [
        { 
          id: "1", 
          name: "John Doe", 
          company: "Acme Corp",
          email: "john@acmecorp.com",
          phone: "555-1234",
          status: "active",
          tags: ["client", "sales"]
        },
        { 
          id: "2", 
          name: "Jane Smith", 
          company: "Beta Inc",
          email: "jane@betainc.com",
          phone: "555-5678",
          status: "active",
          tags: ["prospect"]
        },
      ];
    },
  });

  // Fetch events
  const { data: recentEvents = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<DashboardEvent[]> => {
      // Simulate fetching events from an API
      return [
        { 
          id: "1", 
          title: "Team Meeting", 
          date: new Date("2024-03-15T10:00:00"),
          start: "10:00",
          end: "11:00"
        },
        { 
          id: "2", 
          title: "Client Presentation", 
          date: new Date("2024-03-16T14:00:00"),
          start: "14:00",
          end: "15:30"
        },
      ];
    },
  });

  // Fetch notes for the dashboard
  const { data: recentNotes = [] } = useQuery<Note[]>({
    queryKey: ['dashboardNotes'],
    queryFn: async () => {
      const notes = await NotesService.getNotes();
      // Only return the 3 most recent notes
      return notes.slice(0, 3);
    },
  });

  // Calculate metrics with updated values as requested
  const totalRevenue = 54000;
  const newCustomers = 24;
  const openTasks = recentTasks.filter(task => !task.completed).length;

  return {
    recentTasks,
    recentContacts,
    recentEvents,
    recentNotes,
    metrics: {
      totalRevenue,
      newCustomers,
      openTasks
    }
  };
}
