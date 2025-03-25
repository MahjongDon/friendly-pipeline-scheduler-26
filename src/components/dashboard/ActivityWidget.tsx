
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  FileText, 
  UserPlus, 
  Calendar 
} from "lucide-react";

// Sample activity data
const activities = [
  {
    id: "1",
    type: "message",
    user: "Alex Johnson",
    content: "Left a comment on proposal",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "note",
    user: "Sarah Miller",
    content: "Created a new note",
    time: "3 hours ago",
  },
  {
    id: "3",
    type: "contact",
    user: "Robert Wilson",
    content: "Added a new contact",
    time: "5 hours ago",
  },
  {
    id: "4",
    type: "meeting",
    user: "Emily Davis",
    content: "Scheduled a meeting",
    time: "Yesterday",
  },
];

// Define icons based on activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    case "note":
      return <FileText className="h-4 w-4" />;
    case "contact":
      return <UserPlus className="h-4 w-4" />;
    case "meeting":
      return <Calendar className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const ActivityWidget: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {activity.user.split(" ").map(name => name[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.user}</p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="py-0 px-1">
                  {getActivityIcon(activity.type)}
                </Badge>
                <p className="text-sm">{activity.content}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityWidget;
