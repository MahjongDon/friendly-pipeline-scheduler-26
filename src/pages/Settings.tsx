
import React, { useState } from "react";
import { User, Lock, BellRing, Globe, Palette, Database, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Profile form state
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");
  const [company, setCompany] = useState("CRM Solutions Inc.");
  const [role, setRole] = useState("Sales Manager");

  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile settings saved successfully");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings updated");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password changed successfully");
  };

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
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          
          <div className="bg-white rounded-lg border">
            <Tabs defaultValue="profile" className="w-full">
              <div className="sm:flex">
                <TabsList className="sm:flex-col h-auto p-0 bg-transparent border-r sm:w-56 sm:rounded-none">
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start data-[state=active]:bg-muted/50 rounded-none border-b sm:border-b-0 sm:border-r sm:data-[state=active]:border-r-transparent p-3 sm:w-full"
                  >
                    <User className="h-4 w-4 mr-2" /> Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start data-[state=active]:bg-muted/50 rounded-none border-b sm:border-b-0 sm:border-r sm:data-[state=active]:border-r-transparent p-3 sm:w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start data-[state=active]:bg-muted/50 rounded-none border-b sm:border-b-0 sm:border-r sm:data-[state=active]:border-r-transparent p-3 sm:w-full"
                  >
                    <BellRing className="h-4 w-4 mr-2" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="justify-start data-[state=active]:bg-muted/50 rounded-none border-b sm:border-b-0 sm:border-r sm:data-[state=active]:border-r-transparent p-3 sm:w-full"
                  >
                    <Palette className="h-4 w-4 mr-2" /> Appearance
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 p-6">
                  <TabsContent value="profile" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your personal information.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            value={company} 
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Input 
                            id="role" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                          />
                        </div>
                        
                        <Button type="submit">Save changes</Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Security</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your password and security settings.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        
                        <Button type="submit">Update password</Button>
                      </form>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-4">Two-factor Authentication</h4>
                        <Button variant="outline">Enable two-factor auth</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure how and when you want to be notified.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <form onSubmit={handleSaveNotifications} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive email updates on your CRM activity</p>
                          </div>
                          <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                          </div>
                          <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Task Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get notified about upcoming deadlines</p>
                          </div>
                          <Switch checked={taskReminders} onCheckedChange={setTaskReminders} />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                          </div>
                          <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                        </div>
                        
                        <Button type="submit">Save preferences</Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Appearance</h3>
                        <p className="text-sm text-muted-foreground">
                          Customize how your CRM interface looks.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label>Theme</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Light</Button>
                            <Button variant="outline" className="flex-1">Dark</Button>
                            <Button variant="default" className="flex-1">System</Button>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Density</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Compact</Button>
                            <Button variant="default" className="flex-1">Default</Button>
                            <Button variant="outline" className="flex-1">Comfortable</Button>
                          </div>
                        </div>
                        
                        <Button onClick={() => toast.success("Appearance settings saved")}>
                          Save preferences
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
