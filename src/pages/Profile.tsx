
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    loading,
    profile,
    formData,
    handleInputChange,
    handleSaveProfile
  } = useProfile(user?.id);

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
              <ProfileSidebar 
                profile={profile} 
                formData={formData} 
                userEmail={user?.email}
              />
            </div>
            
            <div className="md:col-span-2">
              <ProfileTabs 
                formData={formData}
                loading={loading}
                userEmail={user?.email}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
