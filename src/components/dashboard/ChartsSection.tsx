
import React from "react";
import TaskCompletionChart from "./TaskCompletionChart";
import SalesPipelineChart from "./SalesPipelineChart";
import { taskCompletionData, salesPipelineData } from "@/data/dashboardData";

const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <TaskCompletionChart data={taskCompletionData} />
      <SalesPipelineChart data={salesPipelineData} />
    </div>
  );
};

export default ChartsSection;
