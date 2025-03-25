
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, Users, ClipboardList } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskWidget from "@/components/dashboard/TaskWidget";
import NotesWidget from "@/components/notes/NotesWidget";
import ContactsWidget from "@/components/dashboard/ContactsWidget";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import ActivityWidget from "@/components/dashboard/ActivityWidget";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { DemoModeToggle } from "@/components/dashboard/DemoModeToggle";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isDemoMode } = useDemoMode();
  
  // Fetch all dashboard data using the custom hook
  const { 
    recentTasks, 
    recentContacts, 
    recentEvents, 
    recentNotes,
    metrics
  } = useDashboardData(isDemoMode);

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
            <DashboardMetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue}`}
              description="+20% from last month"
              icon={CircleDollarSign}
            />
            
            <DashboardMetricCard
              title="New Customers"
              value={metrics.newCustomers}
              description="+12% from last month"
              icon={Users}
            />
            
            <DashboardMetricCard
              title="Open Tasks"
              value={metrics.openTasks}
              description="3 tasks due this week"
              icon={ClipboardList}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="col-span-1">
              <TaskWidget 
                tasks={recentTasks} 
                onComplete={(id) => console.log(`Complete task ${id}`)}
                onViewDetails={(id) => navigate(`/tasks?id=${id}`)}
              />
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
