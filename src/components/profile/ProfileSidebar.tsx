
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Mail, Phone, Tag } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ProfileSidebarProps {
  profile: UserProfile | null;
  formData: {
    first_name: string;
    last_name: string;
    company: string;
    job_title: string;
    phone: string;
  };
  userEmail: string | undefined;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile, formData, userEmail }) => {
  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase();
    }
    return userEmail?.charAt(0).toUpperCase() || '?';
  };

  return (
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
            : userEmail?.split('@')[0] || 'User'}
        </h3>
        <p className="text-muted-foreground">{userEmail}</p>
        
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
            <span>{userEmail}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
