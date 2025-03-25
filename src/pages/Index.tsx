import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  CalendarPlus, 
  CheckCircle2, 
  ListChecks, 
  PieChart, 
  Plus, 
  RefreshCw, 
  Settings, 
  StickyNote, 
  Target, 
  UserPlus, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardCard from "@/components/dashboard/DashboardCard";
import SummaryWidget from "@/components/dashboard/SummaryWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TaskWidget from "@/components/dashboard/TaskWidget";
import ContactsWidget from "@/components/dashboard/ContactsWidget";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import AnalyticsWidget from "@/components/dashboard/AnalyticsWidget";
import NotesWidget from "@/components/notes/NotesWidget";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { initialTasks } from "@/types/task";
import { sampleContacts } from "@/data/sampleContacts";
import { 
  sampleActivities, 
  taskSummary, 
  eventSummary, 
  contactSummary, 
  dealSummary,
  getPriorityTasks,
  getRecentContacts,
  taskCompletionData,
  salesPipelineData
} from "@/data/dashboardData";
import { Task } from "@/types/task";
import { Note } from "@/types/note";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Sample calendar events
const sampleEvents = [
  {
    id: "event-1",
    title: "Team Meeting",
    start: new Date(new Date().getTime()),
    end: new Date(new Date().getTime()),
    description: "Weekly team sync meeting",
    location: "Conference Room A"
  },
  {
    id: "event-2",
    title: "Product Demo",
    start: new Date(new Date().getTime()),
    end: new Date(new Date().getTime()),
    description: "Demo of new features for Acme Corp",
    location: "Virtual Meeting"
  },
  {
    id: "event-3",
    title: "Client Call",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    description: "Follow-up call with potential client"
  },
  {
    id: "event-4",
    title: "Marketing Review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: "Review Q3 marketing campaign results"
  },
  {
    id: "event-5",
    title: "Strategy Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    description: "Quarterly strategy planning session"
  }
];

// Initialize dates with proper hours
(() => {
  const today = new Date();
  
  // Event 1: Set to 10:00 AM - 11:00 AM today
  sampleEvents[0].start.setHours(10, 0, 0, 0);
  sampleEvents[0].end.setHours(11, 0, 0, 0);
  
  // Event 2: Set to 2:00 PM - 3:30 PM today
  sampleEvents[1].start.setHours(14, 0, 0, 0);
  sampleEvents[1].end.setHours(15, 30, 0, 0);
  
  // Event 4: Set to 1:00 PM - 2:00 PM on day+2
  sampleEvents[3].start.setHours(13, 0, 0, 0);
  sampleEvents[3].end.setHours(14, 0, 0, 0);
  
  // Event 5: Set to 9:00 AM - 12:00 PM on day+3
  sampleEvents[4].start.setHours(9, 0, 0, 0);
  sampleEvents[4].end.setHours(12, 0, 0, 0);
})();

const Index = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [timePeriod, setTimePeriod] = useState("week");
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch notes for the dashboard widget
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['notes', 'recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching notes:", error);
        return [];
      }
      
      return data as Note[];
    },
  });

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshDashboard();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const refreshDashboard = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
      toast.success("Dashboard refreshed");
    }, 1000);
  };
  
  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    toast.success("Task marked as complete");
  };
  
  const formatCurrency = (value: number | string) => {
    return `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };
  
  const formatPercentage = (value: number | string) => {
    return `${value}%`;
  };

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your CRM metrics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshDashboard}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              
              <Select defaultValue={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Button variant="outline" className="flex-col h-20 space-y-1" onClick={() => navigate("/tasks")}>
              <ListChecks className="h-5 w-5" />
              <span>New Task</span>
            </Button>
            <Button variant="outline" className="flex-col h-20 space-y-1" onClick={() => navigate("/contacts")}>
              <UserPlus className="h-5 w-5" />
              <span>New Contact</span>
            </Button>
            <Button variant="outline" className="flex-col h-20 space-y-1" onClick={() => navigate("/calendar")}>
              <CalendarPlus className="h-5 w-5" />
              <span>New Event</span>
            </Button>
            <Button variant="outline" className="flex-col h-20 space-y-1" onClick={() => navigate("/notes")}>
              <StickyNote className="h-5 w-5" />
              <span>New Note</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryWidget 
              title="Active Leads" 
              value={contactSummary.totalContacts} 
              change={12}
              description="Total active contacts"
              icon={<Users className="h-5 w-5" />}
            />
            
            <SummaryWidget 
              title="Pipeline Value" 
              value={dealSummary.totalValue} 
              change={5}
              description="Total deal value"
              icon={<PieChart className="h-5 w-5" />}
              formatter={formatCurrency}
            />
            
            <SummaryWidget 
              title="Task Completion" 
              value={taskSummary.completionRate} 
              description="Tasks completed"
              icon={<CheckCircle2 className="h-5 w-5" />}
              formatter={formatPercentage}
            />
            
            <SummaryWidget 
              title="Win Rate" 
              value={dealSummary.winRate} 
              change={3.2}
              description="Deals won vs. lost"
              icon={<Target className="h-5 w-5" />}
              formatter={formatPercentage}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AnalyticsWidget 
              title="Task Completion" 
              description="Daily task progress for the week" 
              data={taskCompletionData}
              type="bar"
              dataKeys={["completed", "pending"]}
              colors={["#10b981", "#f59e0b"]}
            />
            
            <AnalyticsWidget 
              title="Sales Pipeline" 
              description="Current deals by stage" 
              data={salesPipelineData}
              type="bar"
              dataKeys={["value"]}
              colors={["#3b82f6"]}
            />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <TaskWidget 
              tasks={getPriorityTasks(tasks)}
              onComplete={handleCompleteTask}
              onViewDetails={(id) => navigate(`/tasks?id=${id}`)}
            />
            
            <CalendarWidget 
              events={sampleEvents}
              onAddEvent={() => navigate("/calendar?action=add")}
              onEventClick={(id) => navigate(`/calendar?event=${id}`)}
            />
            
            <div className="flex flex-col gap-6">
              <NotesWidget 
                notes={notes}
                onAddNote={() => navigate("/notes?action=add")}
                onNoteClick={(id) => navigate(`/notes?id=${id}`)}
              />
              
              <ContactsWidget 
                contacts={getRecentContacts(sampleContacts)}
                onAddContact={() => navigate("/contacts?action=add")}
                onContactClick={(id) => navigate(`/contacts?id=${id}`)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <ActivityFeed 
              activities={sampleActivities}
              maxItems={5}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
