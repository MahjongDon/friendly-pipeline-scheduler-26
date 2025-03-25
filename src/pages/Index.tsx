import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Users, ClipboardList } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskWidget from "@/components/dashboard/TaskWidget";
import NotesWidget from "@/components/notes/NotesWidget";
import ContactsWidget from "@/components/dashboard/ContactsWidget";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import ActivityWidget from "@/components/dashboard/ActivityWidget";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { NotesService } from "@/services/notes-service";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { DemoModeToggle } from "@/components/dashboard/DemoModeToggle";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isDemoMode } = useDemoMode();

  // Fetch tasks
  const { data: recentTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // Simulate fetching tasks from an API
      return [
        { id: "1", title: "Design CRM Dashboard", completed: true },
        { id: "2", title: "Conduct User Research", completed: false },
        { id: "3", title: "Implement Authentication", completed: false },
      ];
    },
  });

  // Fetch events
  const { data: recentEvents = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Simulate fetching events from an API
      return [
        { id: "1", title: "Team Meeting", date: "2024-03-15T10:00:00" },
        { id: "2", title: "Client Presentation", date: "2024-03-16T14:00:00" },
      ];
    },
  });

  // Fetch contacts
  const { data: recentContacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      // Simulate fetching contacts from an API
      return [
        { id: "1", name: "John Doe", company: "Acme Corp" },
        { id: "2", name: "Jane Smith", company: "Beta Inc" },
      ];
    },
  });

  // Fetch notes for the dashboard
  const { data: recentNotes = [] } = useQuery({
    queryKey: ['dashboardNotes', isDemoMode],
    queryFn: async () => {
      const notes = await NotesService.getNotes(isDemoMode);
      // Only return the 3 most recent notes
      return notes.slice(0, 3);
    },
  });

  // Calculate metrics
  const totalRevenue = 54000;
  const newCustomers = 24;
  const openTasks = recentTasks.filter(task => !task.completed).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to your CRM dashboard</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <DemoModeToggle />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">${totalRevenue}</div>
                <p className="text-sm text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  New Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{newCustomers}</div>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Open Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{openTasks}</div>
                <p className="text-sm text-muted-foreground">3 tasks due this week</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="col-span-1">
              <TaskWidget tasks={recentTasks} />
            </div>
            <div className="col-span-1">
              <NotesWidget 
                notes={recentNotes} 
                onAddNote={() => navigate('/notes')}
                onNoteClick={(noteId) => navigate(`/notes?id=${noteId}`)}
              />
            </div>
            <div className="col-span-1">
              <ContactsWidget 
                contacts={recentContacts} 
                onAddContact={() => navigate('/contacts')}
                onContactClick={(contactId) => navigate(`/contacts?id=${contactId}`)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="col-span-1">
              <CalendarWidget events={recentEvents} />
            </div>
            <div className="col-span-1">
              <ActivityWidget />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
