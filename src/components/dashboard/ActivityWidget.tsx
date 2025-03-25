
import React from "react";
import { Activity, CheckSquare, Mail, Plus, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sampleActivities } from "@/data/dashboardData";

interface ActivityWidgetProps {
  limit?: number;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({ limit = 5 }) => {
  // Use a subset of the sample activities based on the limit
  const activities = sampleActivities.slice(0, limit);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "contact":
        return <User className="h-4 w-4 text-blue-500" />;
      case "deal":
        return <Activity className="h-4 w-4 text-purple-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-amber-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-rose-500" />;
      default:
        return <Plus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hr ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return format(timestamp, "MMM d");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Feed</CardTitle>
        <Button size="sm" variant="outline">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {activity.user?.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {activity.user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.user?.name || "System"}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityWidget;
