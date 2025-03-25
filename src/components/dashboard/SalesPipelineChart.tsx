
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import ChartCard from "./ChartCard";

interface SalesPipelineChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const SalesPipelineChart: React.FC<SalesPipelineChartProps> = ({ data }) => {
  return (
    <ChartCard 
      title="Sales Pipeline" 
      subtitle="Current deals by stage"
    >
      <div className="h-[300px] mt-4">
        <ChartContainer
          config={{
            value: {
              label: "Value",
              theme: { light: "#3b82f6", dark: "#3b82f6" },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
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
              <Bar dataKey="value" fill="var(--color-value)" barSize={25} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  );
};

export default SalesPipelineChart;
