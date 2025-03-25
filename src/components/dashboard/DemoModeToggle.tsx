
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { HardDrive, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between space-x-2 mb-1">
        <Label htmlFor="demo-mode" className="cursor-pointer">Demo Mode</Label>
        <Switch 
          id="demo-mode" 
          checked={isDemoMode} 
          onCheckedChange={toggleDemoMode} 
        />
      </div>
      <Badge variant={isDemoMode ? "outline" : "secondary"} className="self-start flex items-center">
        {isDemoMode ? (
          <>
            <HardDrive className="h-3 w-3 mr-1" /> Local Storage
          </>
        ) : (
          <>
            <Database className="h-3 w-3 mr-1" /> Database
          </>
        )}
      </Badge>
    </div>
  );
};
