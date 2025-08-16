import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface OnboardingWelcomeEffectProps {
  isFirstVisit: boolean;
}

export default function OnboardingWelcomeEffect({ isFirstVisit }: OnboardingWelcomeEffectProps) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isFirstVisit) {
      // Show welcome effect before onboarding starts
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 500);

      // Hide after brief display
      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 2500);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isFirstVisit]);

  if (!isFirstVisit || !showWelcome) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
      >
        <motion.div
          className="bg-forest text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>
          <span className="font-semibold">Welcome to RÜTZ! 🌿</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}