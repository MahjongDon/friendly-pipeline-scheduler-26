
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<{ error: any }>;
  resendVerificationEmail: (email?: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsVerified(currentSession?.user?.email_confirmed_at != null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsVerified(currentSession?.user?.email_confirmed_at != null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email before signing in");
        }
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Get the current URL of the application for redirect
      const redirectUrl = window.location.origin + "/auth";
      console.log("Email redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      // Get the current URL of the application for redirect
      const redirectUrl = window.location.origin + "/auth";
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        }
      });
      
      if (error) {
        console.error(`Error signing in with ${provider}:`, error);
        toast.error(`Failed to sign in with ${provider}`);
      }
      
      return { error };
    } catch (error) {
      console.error(`Unexpected error signing in with ${provider}:`, error);
      return { error };
    }
  };

  const resendVerificationEmail = async (email?: string) => {
    try {
      // Get the current URL of the application for redirect
      const redirectUrl = window.location.origin + "/auth";
      console.log("Email resend redirect URL:", redirectUrl);
      
      if (!email && !user?.email) {
        toast.error("No email address to send verification to");
        return { error: new Error("No email address provided") };
      }
      
      // Use provided email or fall back to user's email
      const emailToUse = email || user?.email || '';
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      if (error) {
        console.error("Error resending verification email:", error);
        if (error.message.includes("For security purposes")) {
          toast.error("Please wait a few minutes before requesting another email");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(`Verification email resent to ${emailToUse}. Please check your inbox`);
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error resending verification email:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isVerified,
      signIn, 
      signUp,
      signInWithProvider,
      resendVerificationEmail, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
