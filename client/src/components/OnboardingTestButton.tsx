import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

// Development component to test onboarding
export default function OnboardingTestButton() {
  const { resetOnboarding } = useOnboarding();

  const handleReset = () => {
    resetOnboarding();
    // Refresh the page to see the effect
    window.location.reload();
  };

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <Button
      onClick={handleReset}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-40 flex items-center space-x-2 bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
      data-testid="reset-onboarding"
    >
      <RotateCcw className="w-4 h-4" />
      <span>Test Onboarding</span>
    </Button>
  );
}