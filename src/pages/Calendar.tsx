
import React, { useState } from "react";
import { PlusCircle, Filter, ChevronDown, Grid, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CalendarView from "@/components/calendar/CalendarView";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Calendar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Calendar</h1>
              <p className="text-muted-foreground">Schedule and manage your events</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Grid className="h-4 w-4 mr-2" /> View <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Day</DropdownMenuItem>
                  <DropdownMenuItem>Week</DropdownMenuItem>
                  <DropdownMenuItem>Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/30">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Meetings
                </Button>
                <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-100">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2" /> Deadlines
                </Button>
                <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Social
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-50 text-purple-600 border-purple-100">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" /> Sales
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" /> My Calendar
              </Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <CalendarView />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
