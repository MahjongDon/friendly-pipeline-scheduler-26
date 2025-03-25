
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode } = useDemoMode();

  const handleInfoClick = () => {
    toast.info("This app uses localStorage for data persistence");
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-x-2 mb-1">
        <Label htmlFor="demo-mode" className="cursor-pointer" onClick={handleInfoClick}>Demo Mode</Label>
        <Switch 
          id="demo-mode" 
          checked={isDemoMode} 
          disabled={true}
          onCheckedChange={() => {}}
        />
      </div>
      <Badge variant="outline" className="self-start flex items-center">
        <HardDrive className="h-3 w-3 mr-1" /> Local Storage
      </Badge>
    </div>
  );
};
