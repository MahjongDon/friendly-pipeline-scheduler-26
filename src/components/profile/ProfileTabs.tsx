
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileDetailsForm from "./ProfileDetailsForm";
import AccountSettings from "./AccountSettings";

interface ProfileTabsProps {
  formData: {
    first_name: string;
    last_name: string;
    company: string;
    job_title: string;
    phone: string;
  };
  loading: boolean;
  userEmail: string | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfile: () => Promise<void>;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  formData, 
  loading, 
  userEmail,
  handleInputChange, 
  handleSaveProfile 
}) => {
  return (
    <Tabs defaultValue="details">
      <TabsList className="mb-4">
        <TabsTrigger value="details">Personal Info</TabsTrigger>
        <TabsTrigger value="account">Account Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <ProfileDetailsForm 
          formData={formData}
          loading={loading}
          handleInputChange={handleInputChange}
          handleSaveProfile={handleSaveProfile}
        />
      </TabsContent>
      
      <TabsContent value="account">
        <AccountSettings userEmail={userEmail} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
