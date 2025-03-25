import { ActivityItem, DashboardWidget, TaskSummary, EventSummary, ContactSummary, DealSummary } from "@/types/dashboard";
import { Task } from "@/types/task";
import { Contact } from "@/types/contact";

// Sample dashboard widgets
export const defaultWidgets: DashboardWidget[] = [
  {
    id: "widget-summary-tasks",
    type: "summary",
    title: "Task Summary",
    position: 1,
    size: "small"
  },
  {
    id: "widget-summary-events",
    type: "summary",
    title: "Event Summary",
    position: 2,
    size: "small"
  },
  {
    id: "widget-summary-contacts",
    type: "summary",
    title: "Contact Summary",
    position: 3,
    size: "small"
  },
  {
    id: "widget-summary-deals",
    type: "summary",
    title: "Deal Summary",
    position: 4,
    size: "small"
  },
  {
    id: "widget-chart-tasks",
    type: "chart",
    title: "Task Completion",
    position: 5,
    size: "medium"
  },
  {
    id: "widget-tasks",
    type: "tasks",
    title: "Priority Tasks",
    position: 6,
    size: "medium"
  },
  {
    id: "widget-calendar",
    type: "calendar",
    title: "Upcoming Events",
    position: 7,
    size: "medium"
  },
  {
    id: "widget-contacts",
    type: "contacts",
    title: "Recent Contacts",
    position: 8,
    size: "medium"
  },
  {
    id: "widget-activity",
    type: "activity",
    title: "Activity Feed",
    position: 9,
    size: "large"
  }
];

// Sample activity data
export const sampleActivities: ActivityItem[] = [
  {
    id: "activity-1",
    type: "task",
    title: "Task Completed",
    description: "Sarah completed 'Send proposal to GlobalTech'",
    timestamp: new Date(Date.now() - 8000000),
    linkedId: "task-2",
    linkedType: "task",
    user: {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg"
    }
  },
  {
    id: "activity-2",
    type: "contact",
    title: "New Contact Added",
    description: "New lead: John Smith from InnovateTech",
    timestamp: new Date(Date.now() - 12000000),
    linkedId: "contact-6",
    linkedType: "contact",
    user: {
      id: "user-2",
      name: "Michael Brown"
    }
  },
  {
    id: "activity-3",
    type: "deal",
    title: "Deal Stage Changed",
    description: "Website redesign project moved to Negotiation stage",
    timestamp: new Date(Date.now() - 24000000),
    linkedId: "deal-3",
    linkedType: "deal",
    user: {
      id: "user-3",
      name: "Jessica Lee"
    }
  },
  {
    id: "activity-4",
    type: "email",
    title: "Email Sent",
    description: "Follow-up email sent to Robert Chen",
    timestamp: new Date(Date.now() - 36000000),
    linkedId: "email-5",
    linkedType: "email",
    user: {
      id: "user-4",
      name: "You"
    }
  },
  {
    id: "activity-5",
    type: "event",
    title: "Meeting Scheduled",
    description: "Product demo with Acme Corp at 2pm",
    timestamp: new Date(Date.now() - 48000000),
    linkedId: "event-2",
    linkedType: "event",
    user: {
      id: "user-1",
      name: "Sarah Johnson"
    }
  }
];

// Sample summary data with updated values
export const taskSummary: TaskSummary = {
  totalTasks: 28,
  completedTasks: 12,
  upcomingTasks: 8,
  overdueTasks: 3,
  completionRate: 88.8 // updated as requested
};

export const eventSummary: EventSummary = {
  today: 2,
  tomorrow: 3,
  thisWeek: 8,
  upcoming: 12
};

export const contactSummary: ContactSummary = {
  totalContacts: 94,
  newContacts: 12,
  activeContacts: 777, // updated as requested
  inactiveContacts: 14
};

export const dealSummary: DealSummary = {
  totalValue: 125555, // updated as requested
  averageValue: 13200,
  totalDeals: 23,
  wonDeals: 8,
  lostDeals: 4,
  winRate: 96.7 // updated as requested
};

// Helper function to get priority tasks
export const getPriorityTasks = (tasks: Task[]): Task[] => {
  return tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      // If same priority, sort by due date
      if (priorityDiff === 0) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return priorityDiff;
    })
    .slice(0, 5); // Get top 5 priority tasks
};

// Helper function to get recent contacts
export const getRecentContacts = (contacts: Contact[]): Contact[] => {
  return [...contacts]
    .sort((a, b) => {
      const dateA = a.lastContact ? new Date(a.lastContact).getTime() : 0;
      const dateB = b.lastContact ? new Date(b.lastContact).getTime() : 0;
      return dateB - dateA; // Sort by most recent first
    })
    .slice(0, 5); // Get top 5 recent contacts
};

// Task completion data for chart
export const taskCompletionData = [
  { name: "Mon", completed: 4, pending: 2 },
  { name: "Tue", completed: 3, pending: 3 },
  { name: "Wed", completed: 5, pending: 1 },
  { name: "Thu", completed: 2, pending: 4 },
  { name: "Fri", completed: 6, pending: 2 },
  { name: "Sat", completed: 1, pending: 1 },
  { name: "Sun", completed: 0, pending: 2 },
];

// Sales pipeline data for chart - changed to be compatible with column chart
export const salesPipelineData = [
  { name: "Lead", value: 34 },
  { name: "Qualified", value: 24 },
  { name: "Proposal", value: 18 },
  { name: "Negotiation", value: 12 },
  { name: "Closed", value: 8 },
];
