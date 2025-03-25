
import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarWidget from "./CalendarWidget";
import { DashboardEvent } from "@/hooks/use-dashboard-data";
import { sampleActivities } from "@/data/dashboardData";

interface BottomSectionProps {
  events: DashboardEvent[];
}

const BottomSection: React.FC<BottomSectionProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="col-span-1">
        <CalendarWidget events={events} />
      </div>
      <div className="col-span-1">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{activity.user?.name || "System"}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BottomSection;
