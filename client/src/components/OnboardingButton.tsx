import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function OnboardingButton() {
  const { startOnboarding } = useOnboarding();

  return (
    <Button
      onClick={startOnboarding}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 text-sage border-sage hover:bg-sage hover:text-white transition-colors"
      data-testid="start-onboarding"
    >
      <Play className="w-4 h-4" />
      <span>Tour the Platform</span>
    </Button>
  );
}