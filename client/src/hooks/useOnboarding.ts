import { useState, useEffect } from "react";

const ONBOARDING_STORAGE_KEY = "rutz-onboarding-completed";

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const isFirstVisit = !completed;
    
    setHasCompletedOnboarding(!isFirstVisit);
    
    // Show onboarding for first-time users after a brief delay
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);
  };

  const startOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setHasCompletedOnboarding(false);
    setIsOnboardingOpen(true);
  };

  return {
    hasCompletedOnboarding,
    isOnboardingOpen,
    completeOnboarding,
    startOnboarding,
    resetOnboarding
  };
}