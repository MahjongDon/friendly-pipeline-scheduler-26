
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActionsSection from "@/components/dashboard/QuickActionsSection";
import MetricsSection from "@/components/dashboard/MetricsSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import { contactSummary, dealSummary, taskSummary } from "@/data/dashboardData";

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
          
          <QuickActionsSection />
          
          <MetricsSection 
            activeLeads={contactSummary.activeContacts}
            activeLeadsChange={12}
            pipelineValue={dealSummary.totalValue}
            pipelineValueChange={5}
            taskCompletion={taskSummary.completionRate}
            winRate={dealSummary.winRate}
            winRateChange={3.2}
          />
          
          <ChartsSection />
        </main>
      </div>
    </div>
  );
};

export default Index;
