
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;  // Keep as Date for type safety
  completed: boolean;
  createdAt: Date; // Keep as Date for type safety
}

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Prepare client presentation",
    description: "Create slides for the quarterly business review",
    category: "work",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    completed: false,
    createdAt: new Date()
  },
  {
    id: "task-2",
    title: "Review marketing materials",
    description: "Check new brochure designs from the design team",
    category: "marketing",
    priority: "medium",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "task-3",
    title: "Follow up with leads",
    description: "Contact prospects from the recent trade show",
    category: "sales",
    priority: "high",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: "task-4",
    title: "Update CRM data",
    description: "Clean up contact information in the system",
    category: "admin",
    priority: "low",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
  }
];
