import { useState } from 'react';
import { toast } from 'sonner';

// Define a key for storing the demo mode preference in localStorage
const DEMO_MODE_KEY = 'app_demo_mode_enabled';

export function useDemoMode() {
  // Since we've removed Supabase, we'll always consider the app in "demo mode"
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Toggle function remains for UI compatibility, but effectively does nothing
  const toggleDemoMode = () => {
    toast.info("App is running in demo mode with localStorage only");
    // We keep the setIsDemoMode call for React state updates
    setIsDemoMode(true);
  };

  return { isDemoMode, toggleDemoMode };
}
