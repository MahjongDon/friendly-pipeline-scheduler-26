
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useProfile = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    job_title: "",
    phone: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If the profile doesn't exist yet, create an empty one
        if (error.code === 'PGRST116') {
          // Create a new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: '',
              last_name: '',
              company: '',
              job_title: '',
              phone: ''
            });
            
          if (insertError) {
            throw insertError;
          }
          
          // Fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (fetchError) throw fetchError;
          
          setProfile(newProfile);
          setFormData({
            first_name: newProfile.first_name || '',
            last_name: newProfile.last_name || '',
            company: newProfile.company || '',
            job_title: newProfile.job_title || '',
            phone: newProfile.phone || '',
          });
          setIsInitialized(true);
          return;
        }
        
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
        setIsInitialized(true);
      } 
    } catch (error) {
      console.error('Error in profile process:', error);
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
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: formData.company,
          job_title: formData.job_title,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      
      // Update local state to reflect the changes
      setProfile({
        ...(profile || {}),
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company,
        job_title: formData.job_title,
        phone: formData.phone,
      } as UserProfile);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && !isInitialized) {
      fetchProfile();
    }
  }, [userId, isInitialized]);

  return {
    loading,
    profile,
    formData,
    handleInputChange,
    handleSaveProfile,
    fetchProfile
  };
};
