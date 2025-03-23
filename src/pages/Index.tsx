
import React, { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowRight, Calendar, CheckCircle2, ListChecks, PieChart, Plus, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import TasksList from "@/components/tasks/TasksList";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data
const pipelineData = [
  { name: "Lead", value: 34 },
  { name: "Qualified", value: 24 },
  { name: "Proposal", value: 18 },
  { name: "Negotiation", value: 12 },
  { name: "Closed", value: 8 },
];

const Index = () => {
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
            <h1 className="text-2xl font-semibold mb-1">Welcome back!</h1>
            <p className="text-muted-foreground">Here's an overview of your CRM data and tasks.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard title="Active Leads" icon={<Users className="h-5 w-5" />}>
              <div className="flex items-end">
                <span className="text-3xl font-semibold">94</span>
                <span className="text-sm text-emerald-500 ml-2 mb-1">+12% this month</span>
              </div>
              <div className="mt-2">
                <Button variant="link" size="sm" className="p-0 h-auto flex items-center">
                  View all leads <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Pipeline Value" icon={<PieChart className="h-5 w-5" />}>
              <div className="flex items-end">
                <span className="text-3xl font-semibold">$126.5k</span>
                <span className="text-sm text-emerald-500 ml-2 mb-1">+5% this week</span>
              </div>
              <div className="mt-2">
                <Button variant="link" size="sm" className="p-0 h-auto flex items-center">
                  View pipeline <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Pending Tasks" icon={<ListChecks className="h-5 w-5" />}>
              <div className="flex items-end">
                <span className="text-3xl font-semibold">28</span>
                <span className="text-sm text-orange-500 ml-2 mb-1">12 due today</span>
              </div>
              <div className="mt-2">
                <Button variant="link" size="sm" className="p-0 h-auto flex items-center">
                  View all tasks <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Meetings Today" icon={<Calendar className="h-5 w-5" />}>
              <div className="flex items-end">
                <span className="text-3xl font-semibold">4</span>
                <span className="text-sm text-slate-500 ml-2 mb-1">Next in 45m</span>
              </div>
              <div className="mt-2">
                <Button variant="link" size="sm" className="p-0 h-auto flex items-center">
                  View calendar <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </DashboardCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Pipeline Overview" description="Deal progress by stage">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        borderRadius: "0.5rem",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }} 
                    />
                    <Bar 
                      dataKey="value" 
                      fill="rgba(59, 130, 246, 0.8)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Recent Activity">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">New deal created</p>
                    <p className="text-sm text-muted-foreground">
                      Website redesign project for Acme Inc. worth $12,000
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Task completed</p>
                    <p className="text-sm text-muted-foreground">
                      Sarah completed "Send proposal to GlobalTech"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">New lead added</p>
                    <p className="text-sm text-muted-foreground">
                      New lead: John Smith from InnovateTech
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View all activity
                </Button>
              </div>
            </DashboardCard>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard 
              title="Today's Tasks" 
              icon={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New Task
                </Button>
              }
            >
              <TasksList />
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
