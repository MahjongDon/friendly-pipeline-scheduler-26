
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings: React.FC = () => {
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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences</p>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <p className="text-muted-foreground mb-4">
                  This is a portfolio demo app. General settings would go here in a full implementation.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <p className="text-muted-foreground mb-4">
                  This is a portfolio demo app. Notification settings would go here in a full implementation.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
                <p className="text-muted-foreground mb-4">
                  This is a portfolio demo app. Appearance settings would go here in a full implementation.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
