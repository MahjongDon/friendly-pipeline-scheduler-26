
import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-muted-foreground font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold mb-1">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {change && (
              <div className="flex items-center mt-1">
                <span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    change.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {change.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {change.isPositive ? "+" : ""}{change.value}%
                </span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-full bg-muted">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
