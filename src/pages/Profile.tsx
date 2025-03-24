
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Building, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    job_title: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // First check if profiles table exists
      const { error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('Profiles table does not exist yet');
        // Use placeholder data for now
        const placeholderProfile = {
          id: user?.id || '',
          first_name: '',
          last_name: '',
          company: '',
          job_title: '',
          phone: '',
          avatar_url: null
        };
        setProfile(placeholderProfile);
        setFormData({
          first_name: placeholderProfile.first_name || '',
          last_name: placeholderProfile.last_name || '',
          company: placeholderProfile.company || '',
          job_title: placeholderProfile.job_title || '',
          phone: placeholderProfile.phone || '',
        });
        return;
      }
      
      // If table exists, fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          company: data.company || '',
          job_title: data.job_title || '',
          phone: data.phone || '',
        });
      } else {
        // Profile doesn't exist yet, use empty data
        const emptyProfile = {
          id: user?.id || '',
          first_name: '',
          last_name: '',
          company: '',
          job_title: '',
          phone: '',
          avatar_url: null
        };
        setProfile(emptyProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Check if profiles table exists first
      const { error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        // Table doesn't exist yet
        toast.info('Profile functionality will be available soon');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: formData.company,
          job_title: formData.job_title,
          phone: formData.phone,
          updated_at: new Date()
        });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
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
            <h1 className="text-2xl font-semibold mb-1">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your public profile details</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pt-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-medium text-lg">
                    {formData.first_name && formData.last_name 
                      ? `${formData.first_name} ${formData.last_name}`
                      : user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3">
                    {formData.company && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formData.company}</span>
                      </div>
                    )}
                    {formData.job_title && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formData.job_title}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Personal Info</TabsTrigger>
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Your Information</CardTitle>
                      <CardDescription>Update your personal and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            placeholder="Your first name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            placeholder="Your last name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Your company name"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="job_title">Job Title</Label>
                        <Input
                          id="job_title"
                          name="job_title"
                          placeholder="Your job title"
                          value={formData.job_title}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="mt-4"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences and security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          placeholder="Your email address"
                          value={user?.email || ''}
                          disabled
                        />
                        <p className="text-sm text-muted-foreground">
                          Your email address cannot be changed
                        </p>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Change Password</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Password changes will be implemented in a future update
                        </p>
                        <Button variant="outline" disabled>
                          Change Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
