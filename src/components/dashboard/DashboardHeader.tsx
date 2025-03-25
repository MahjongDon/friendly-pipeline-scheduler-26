
import React from "react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your CRM metrics</p>
      </div>
      
      <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DashboardHeader;
