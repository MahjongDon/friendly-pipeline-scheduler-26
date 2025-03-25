
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsSection from "@/components/dashboard/MetricsSection";
import WidgetsSection from "@/components/dashboard/WidgetsSection";
import BottomSection from "@/components/dashboard/BottomSection";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
          <DashboardHeader />
          
          <MetricsSection 
            totalRevenue={metrics.totalRevenue}
            newCustomers={metrics.newCustomers}
            openTasks={metrics.openTasks}
          />
          
          <WidgetsSection 
            tasks={recentTasks}
            notes={recentNotes}
            contacts={recentContacts}
          />
          
          <BottomSection events={recentEvents} />
        </main>
      </div>
    </div>
  );
};

export default Index;
