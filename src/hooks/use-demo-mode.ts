
import { useState, useEffect } from 'react';

// Define a key for storing the demo mode preference in localStorage
const DEMO_MODE_KEY = 'app_demo_mode_enabled';

export function useDemoMode() {
  // Initialize state from localStorage or default to false
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem(DEMO_MODE_KEY);
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Persist demo mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(DEMO_MODE_KEY, JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  // Toggle the demo mode state
  const toggleDemoMode = () => setIsDemoMode(prevMode => !prevMode);

  return { isDemoMode, toggleDemoMode };
}
