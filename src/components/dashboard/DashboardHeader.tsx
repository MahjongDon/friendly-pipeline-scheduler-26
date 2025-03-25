
import React from "react";
import { DemoModeToggle } from "./DemoModeToggle";

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your CRM dashboard</p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <DemoModeToggle />
      </div>
    </div>
  );
};

export default DashboardHeader;
