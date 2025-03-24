
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryWidgetProps {
  title: string;
  value: number | string;
  description?: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  formatter?: (value: number | string) => string;
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({
  title,
  value,
  description,
  change,
  icon,
  className,
  formatter = (val) => String(val),
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? formatter(value) : value}</div>
        {(description || change) && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            {description}
            {change && (
              <span className={cn(
                "ml-1 flex items-center",
                isPositive ? "text-emerald-500" : "",
                isNegative ? "text-rose-500" : ""
              )}>
                {isPositive && <ArrowUpRight className="h-3 w-3 mr-1" />}
                {isNegative && <ArrowDownRight className="h-3 w-3 mr-1" />}
                {isPositive ? "+" : ""}{change}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryWidget;
