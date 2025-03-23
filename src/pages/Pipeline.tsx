
import React, { useState } from "react";
import { PlusCircle, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PipelineView from "@/components/pipeline/PipelineView";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Pipeline = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

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
              <h1 className="text-2xl font-semibold mb-1">Sales Pipeline</h1>
              <p className="text-muted-foreground">Manage and track your deals across stages</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Customize
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Deal
              </Button>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">TOTAL DEALS</h3>
                <p className="text-2xl font-semibold mt-1">96</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">TOTAL VALUE</h3>
                <p className="text-2xl font-semibold mt-1">$1.24M</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">AVG DEAL SIZE</h3>
                <p className="text-2xl font-semibold mt-1">$12.9K</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">WIN RATE</h3>
                <p className="text-2xl font-semibold mt-1">42%</p>
              </div>
            </div>
          </div>
          
          <PipelineView />
        </main>
      </div>
    </div>
  );
};

export default Pipeline;
