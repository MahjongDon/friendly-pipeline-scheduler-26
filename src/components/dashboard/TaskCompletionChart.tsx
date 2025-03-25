
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import ChartCard from "./ChartCard";

interface TaskCompletionChartProps {
  data: {
    name: string;
    completed: number;
    pending: number;
  }[];
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ data }) => {
  return (
    <ChartCard 
      title="Task Completion" 
      subtitle="Daily task progress for the week"
    >
      <div className="h-[300px] mt-4">
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              theme: { light: "#10b981", dark: "#10b981" },
            },
            pending: {
              label: "Pending",
              theme: { light: "#f59e0b", dark: "#f59e0b" },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip 
                content={({ active, payload }) => (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload} 
                    formatter={(value) => value}
                  />
                )}
              />
              <Legend wrapperStyle={{ bottom: -10 }} />
              <Bar dataKey="completed" fill="var(--color-completed)" barSize={20} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="var(--color-pending)" barSize={20} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  );
};

export default TaskCompletionChart;
