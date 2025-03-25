
import React from "react";
import { Users, CircleDollarSign, CheckCircle, BarChart } from "lucide-react";
import MetricCard from "./MetricCard";

interface MetricsSectionProps {
  activeLeads: number;
  activeLeadsChange: number;
  pipelineValue: number;
  pipelineValueChange: number;
  taskCompletion: number;
  winRate: number;
  winRateChange: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  activeLeads,
  activeLeadsChange,
  pipelineValue,
  pipelineValueChange,
  taskCompletion,
  winRate,
  winRateChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Active Leads"
        value={activeLeads}
        icon={Users}
        subtitle="Total active contacts"
        change={{ value: activeLeadsChange, isPositive: activeLeadsChange > 0 }}
      />
      
      <MetricCard
        title="Pipeline Value"
        value={`$${pipelineValue.toLocaleString()}`}
        icon={CircleDollarSign}
        subtitle="Total deal value"
        change={{ value: pipelineValueChange, isPositive: pipelineValueChange > 0 }}
      />
      
      <MetricCard
        title="Task Completion"
        value={`${taskCompletion}%`}
        icon={CheckCircle}
        subtitle="Tasks completed"
      />
      
      <MetricCard
        title="Win Rate"
        value={`${winRate}%`}
        icon={BarChart}
        subtitle="Deals won vs. lost"
        change={{ value: winRateChange, isPositive: winRateChange > 0 }}
      />
    </div>
  );
};

export default MetricsSection;
