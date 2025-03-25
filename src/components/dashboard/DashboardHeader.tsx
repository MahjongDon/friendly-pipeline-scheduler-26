
import React from "react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here's an overview of your CRM metrics</p>
    </div>
  );
};

export default DashboardHeader;
