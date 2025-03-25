
import React from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="relative flex w-full max-w-md items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 pl-8 focus-visible:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="ml-2 flex items-center">
          <div className="text-right">
            <p className="text-sm font-medium">Project Alpha 1.0</p>
            <p className="text-xs text-gray-500">CRM Showcase</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
