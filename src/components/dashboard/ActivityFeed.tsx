
import React from "react";
import { Calendar, CheckCircle2, Mail, Phone, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, maxItems = 5 }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-5 w-5" />;
      case "contact":
        return <Users className="h-5 w-5" />;
      case "deal":
        return <Target className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-green-100 text-green-600";
      case "contact":
        return "bg-purple-100 text-purple-600";
      case "deal":
        return "bg-blue-100 text-blue-600";
      case "email":
        return "bg-yellow-100 text-yellow-600";
      case "event":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, maxItems).map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          
          {activities.length > maxItems && (
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View all activity
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
