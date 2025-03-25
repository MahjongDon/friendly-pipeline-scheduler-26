
import React from "react";
import { CircleDollarSign, Users, ClipboardList } from "lucide-react";
import DashboardMetricCard from "./DashboardMetricCard";

interface MetricsSectionProps {
  totalRevenue: number;
  newCustomers: number;
  openTasks: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  totalRevenue, 
  newCustomers, 
  openTasks 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <DashboardMetricCard
        title="Total Revenue"
        value={`$${totalRevenue}`}
        description="+20% from last month"
        icon={CircleDollarSign}
      />
      
      <DashboardMetricCard
        title="New Customers"
        value={newCustomers}
        description="+12% from last month"
        icon={Users}
      />
      
      <DashboardMetricCard
        title="Open Tasks"
        value={openTasks}
        description="3 tasks due this week"
        icon={ClipboardList}
      />
    </div>
  );
};

export default MetricsSection;
