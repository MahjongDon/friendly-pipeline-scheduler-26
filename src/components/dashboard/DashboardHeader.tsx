
import React from "react";
import { Button } from "@/components/ui/button";
import { DemoModeToggle } from "./DemoModeToggle";

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your CRM metrics</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          Refresh
        </Button>
        <DemoModeToggle />
      </div>
    </div>
  );
};

export default DashboardHeader;
