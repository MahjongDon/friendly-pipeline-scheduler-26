
import React, { useState } from "react";
import { PlusCircle, Filter, Calendar as CalendarIcon, List, Users, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TasksList from "@/components/tasks/TasksList";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Tasks = () => {
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
              <h1 className="text-2xl font-semibold mb-1">Tasks</h1>
              <p className="text-muted-foreground">Manage and organize your tasks</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> New Task
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="h-8">
                      <List className="h-4 w-4 mr-2" /> List View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <CalendarIcon className="h-4 w-4 mr-2" /> Calendar View
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Users className="h-4 w-4 mr-2" /> Assignee
                    </Button>
                  </div>
                </div>
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="today" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="bg-white border rounded-lg p-6">
                <TasksList />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
