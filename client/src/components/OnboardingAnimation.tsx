import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Sparkles, Heart, Globe, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: "fadeUp" | "scaleIn" | "slideLeft" | "bounce";
  color: string;
  backgroundGradient: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to RÜTZ",
    description: "Discover the world's finest botanical extracts, rooted in indigenous wisdom and perfected by science.",
    icon: <div className="text-4xl font-bold text-forest">R<span className="text-sage">Ü</span>TZ</div>,
    animation: "scaleIn",
    color: "text-forest",
    backgroundGradient: "from-green-50 to-cream"
  },
  {
    id: "indigenous",
    title: "Indigenous Heritage",
    description: "Every extract honors traditional knowledge from The Cheslatta Carrier Nation's sacred territory.",
    icon: <Leaf className="w-12 h-12 text-sage" />,
    animation: "fadeUp",
    color: "text-sage",
    backgroundGradient: "from-sage/10 to-green-50"
  },
  {
    id: "science",
    title: "Scientific Excellence",
    description: "Advanced Fraunhofer extraction techniques preserve nature's potency with pharmaceutical precision.",
    icon: <Sparkles className="w-12 h-12 text-amber-600" />,
    animation: "bounce",
    color: "text-amber-700",
    backgroundGradient: "from-amber-50 to-yellow-50"
  },
  {
    id: "community",
    title: "Community Impact",
    description: "Your purchase directly supports indigenous communities and sustainable harvesting practices.",
    icon: <Heart className="w-12 h-12 text-rose-500" />,
    animation: "slideLeft",
    color: "text-rose-600",
    backgroundGradient: "from-rose-50 to-pink-50"
  },
  {
    id: "explore",
    title: "Start Exploring",
    description: "Browse our curated collection of premium botanical extracts and find your perfect wellness companion.",
    icon: <Globe className="w-12 h-12 text-forest" />,
    animation: "scaleIn",
    color: "text-forest",
    backgroundGradient: "from-forest/10 to-green-50"
  }
];

const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "backOut" } }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  },
  bounce: {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        y: { type: "spring", bounce: 0.4 }
      } 
    }
  }
};

interface OnboardingAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingAnimation({ isOpen, onComplete }: OnboardingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance through steps
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep, isOpen, isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        data-testid="onboarding-overlay"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-2xl"
        >
          <Card className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white border-b">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-forest' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {currentStep + 1} of {onboardingSteps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
                data-testid="skip-onboarding"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={animationVariants[currentStepData.animation]}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className={`p-12 text-center bg-gradient-to-br ${currentStepData.backgroundGradient} min-h-[400px] flex flex-col justify-center`}
                >
                  {/* Icon */}
                  <motion.div
                    className="mb-8 flex justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {currentStepData.icon}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    className={`text-3xl md:text-4xl font-bold mb-4 ${currentStepData.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentStepData.title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentStepData.description}
                  </motion.p>

                  {/* Special animations for specific steps */}
                  {currentStepData.id === "welcome" && (
                    <motion.div
                      className="mt-6 flex justify-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <Badge className="bg-sage text-white">Premium Quality</Badge>
                      <Badge className="bg-forest text-white">Ethically Sourced</Badge>
                      <Badge className="bg-amber-600 text-white">Science-Backed</Badge>
                    </motion.div>
                  )}

                  {currentStepData.id === "indigenous" && (
                    <motion.div
                      className="mt-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                    >
                      <div className="inline-flex items-center bg-white/80 px-4 py-2 rounded-full">
                        <Leaf className="w-4 h-4 text-sage mr-2" />
                        <span className="text-sm font-semibold text-gray-700">
                          Cheslatta Carrier Nation Partnership
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {currentStepData.id === "science" && (
                    <motion.div
                      className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {["GMP Certified", "Lab Tested", "Standardized"].map((cert, index) => (
                        <motion.div
                          key={cert}
                          className="text-center"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1 + index * 0.2 }}
                        >
                          <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                          <span className="text-xs text-gray-600">{cert}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Progress indicator for auto-play */}
                  {isAutoPlaying && currentStep < onboardingSteps.length - 1 && (
                    <motion.div
                      className="mt-8 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.div
                        className="h-full bg-forest rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* Footer */}
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500"
                data-testid="skip-button"
              >
                Skip Tour
              </Button>

              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentStep(prev => prev - 1);
                    }}
                    data-testid="previous-step"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="bg-forest text-white hover:bg-sage"
                  data-testid="next-step"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    "Start Exploring"
                  ) : (
                    <>
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Background particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-sage/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: -100,
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}