import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Brain, 
  Sparkles, 
  Target, 
  Heart, 
  Leaf, 
  Zap, 
  Shield, 
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product, RecommendationResults } from "@shared/schema";

interface QuestionnaireStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  type: 'multiple' | 'single' | 'checkbox';
  options: { value: string; label: string; description?: string }[];
}

const questionnaire: QuestionnaireStep[] = [
  {
    id: 'healthGoals',
    title: 'What are your primary health goals?',
    subtitle: 'Select all that apply to personalize your recommendations',
    icon: Target,
    type: 'multiple',
    options: [
      { value: 'immune_support', label: 'Immune Support', description: 'Boost natural defenses' },
      { value: 'stress_relief', label: 'Stress Relief', description: 'Manage daily stress' },
      { value: 'energy_boost', label: 'Energy & Vitality', description: 'Natural energy enhancement' },
      { value: 'digestive_health', label: 'Digestive Health', description: 'Gut wellness support' },
      { value: 'sleep_quality', label: 'Better Sleep', description: 'Improve rest quality' },
      { value: 'cognitive_function', label: 'Mental Clarity', description: 'Focus and memory' },
      { value: 'anti_aging', label: 'Anti-Aging', description: 'Longevity support' },
      { value: 'joint_health', label: 'Joint Health', description: 'Mobility support' }
    ]
  },
  {
    id: 'lifestyle',
    title: 'How would you describe your lifestyle?',
    subtitle: 'This helps us match products to your activity level',
    icon: Zap,
    type: 'single',
    options: [
      { value: 'very_active', label: 'Very Active', description: 'Regular intense exercise, athletic lifestyle' },
      { value: 'moderately_active', label: 'Moderately Active', description: 'Regular light exercise, active work' },
      { value: 'lightly_active', label: 'Lightly Active', description: 'Occasional exercise, mostly sedentary work' },
      { value: 'sedentary', label: 'Sedentary', description: 'Minimal exercise, desk-based work' }
    ]
  },
  {
    id: 'preferredFormats',
    title: 'Which product formats do you prefer?',
    subtitle: 'Select your preferred ways to consume botanical extracts',
    icon: Leaf,
    type: 'multiple',
    options: [
      { value: 'tea', label: 'Herbal Teas', description: 'Traditional brewing method' },
      { value: 'capsules', label: 'Capsules', description: 'Convenient daily supplementation' },
      { value: 'powder', label: 'Powders', description: 'Mix into foods or beverages' },
      { value: 'tinctures', label: 'Liquid Extracts', description: 'Concentrated liquid form' },
      { value: 'topical', label: 'Topical Products', description: 'Creams, balms, and oils' },
      { value: 'functional_foods', label: 'Functional Foods', description: 'Enhanced foods and beverages' }
    ]
  },
  {
    id: 'experienceLevel',
    title: 'What\'s your experience with botanical supplements?',
    subtitle: 'We\'ll tailor complexity and dosing recommendations',
    icon: User,
    type: 'single',
    options: [
      { value: 'beginner', label: 'Beginner', description: 'New to botanical supplements' },
      { value: 'intermediate', label: 'Intermediate', description: 'Some experience with natural products' },
      { value: 'advanced', label: 'Advanced', description: 'Experienced with botanical supplements' },
      { value: 'practitioner', label: 'Practitioner', description: 'Healthcare or wellness professional' }
    ]
  },
  {
    id: 'specificConcerns',
    title: 'Any specific health concerns or focus areas?',
    subtitle: 'Optional: Help us provide more targeted recommendations',
    icon: Heart,
    type: 'multiple',
    options: [
      { value: 'inflammation', label: 'Inflammation', description: 'Anti-inflammatory support' },
      { value: 'allergies', label: 'Seasonal Allergies', description: 'Natural allergy relief' },
      { value: 'hormonal_balance', label: 'Hormonal Balance', description: 'Endocrine system support' },
      { value: 'respiratory', label: 'Respiratory Health', description: 'Lung and breathing support' },
      { value: 'cardiovascular', label: 'Heart Health', description: 'Cardiovascular wellness' },
      { value: 'skin_health', label: 'Skin Health', description: 'Natural skincare support' },
      { value: 'detox', label: 'Detoxification', description: 'Natural cleansing support' },
      { value: 'mood_support', label: 'Mood Support', description: 'Emotional wellness' }
    ]
  }
];

export default function PersonalizedRecommendationEngine() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: recommendations, isLoading: isGeneratingRecommendations } = useQuery<RecommendationResults>({
    queryKey: ['/api/recommendations', answers],
    enabled: showResults && Object.keys(answers).length > 0,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: (preferences: any) => apiRequest('/api/recommendations', 'POST', preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      setShowResults(true);
    }
  });

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questionnaire.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Generate recommendations
      const sessionId = 'current-session'; // In real app, get from session
      generateRecommendationsMutation.mutate({
        sessionId,
        ...answers
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const startQuestionnaire = () => {
    setIsOpen(true);
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const getCurrentQuestion = () => questionnaire[currentStep];
  const currentAnswer = answers[getCurrentQuestion()?.id];
  const progress = ((currentStep + 1) / questionnaire.length) * 100;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="border-2 border-rutz-gold/30 hover:border-rutz-gold transition-all duration-300 bg-gradient-to-br from-white to-rutz-cream/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rutz-gold to-amber-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-rutz-forest mb-2">
              Personalized Plant Recommendation Engine
            </CardTitle>
            <p className="text-rutz-sage text-sm leading-relaxed">
              Discover botanical extracts perfectly matched to your unique health journey through our AI-powered recommendation system
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Sparkles className="h-6 w-6 text-rutz-gold mx-auto mb-2" />
                <p className="text-xs font-medium text-rutz-forest">AI-Powered</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-rutz-gold mx-auto mb-2" />
                <p className="text-xs font-medium text-rutz-forest">Science-Based</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-rutz-gold mx-auto mb-2" />
                <p className="text-xs font-medium text-rutz-forest">2-min Survey</p>
              </div>
            </div>
            <Button 
              onClick={startQuestionnaire}
              className="bg-rutz-gold hover:bg-rutz-gold/90 text-white font-semibold px-8 py-3"
              data-testid="start-recommendation-quiz"
            >
              Get My Personal Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questionnaire Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showResults ? (
                <>
                  {/* Progress Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-rutz-forest">Personal Recommendations</h2>
                      <Badge variant="outline" className="border-rutz-gold text-rutz-forest">
                        {currentStep + 1} of {questionnaire.length}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  {getCurrentQuestion() && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 bg-rutz-gold/20 rounded-full flex items-center justify-center mb-4">
                          {React.createElement(getCurrentQuestion().icon, { className: "h-6 w-6 text-rutz-gold" })}
                        </div>
                        <h3 className="text-xl font-semibold text-rutz-forest mb-2">
                          {getCurrentQuestion().title}
                        </h3>
                        <p className="text-rutz-sage text-sm">
                          {getCurrentQuestion().subtitle}
                        </p>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-3">
                        {getCurrentQuestion().type === 'single' ? (
                          <RadioGroup
                            value={currentAnswer as string}
                            onValueChange={(value) => handleAnswer(getCurrentQuestion().id, value)}
                          >
                            {getCurrentQuestion().options.map((option) => (
                              <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-rutz-gold/50 transition-colors">
                                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-rutz-forest">{option.label}</div>
                                  {option.description && (
                                    <div className="text-sm text-rutz-sage mt-1">{option.description}</div>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          // Multiple choice
                          <div className="space-y-3">
                            {getCurrentQuestion().options.map((option) => (
                              <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-rutz-gold/50 transition-colors">
                                <Checkbox
                                  id={option.value}
                                  checked={(currentAnswer as string[] || []).includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentAnswers = (currentAnswer as string[]) || [];
                                    if (checked) {
                                      handleAnswer(getCurrentQuestion().id, [...currentAnswers, option.value]);
                                    } else {
                                      handleAnswer(getCurrentQuestion().id, currentAnswers.filter(a => a !== option.value));
                                    }
                                  }}
                                  className="mt-1"
                                />
                                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-rutz-forest">{option.label}</div>
                                  {option.description && (
                                    <div className="text-sm text-rutz-sage mt-1">{option.description}</div>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between pt-6">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
                          className="bg-rutz-gold hover:bg-rutz-gold/90"
                        >
                          {currentStep === questionnaire.length - 1 ? 'Get Recommendations' : 'Next'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Results */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-rutz-forest mb-2">Your Personalized Recommendations</h2>
                    <p className="text-rutz-sage">Based on your preferences and health goals</p>
                  </div>

                  {isGeneratingRecommendations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rutz-gold mx-auto mb-4"></div>
                      <p className="text-rutz-sage">Analyzing your preferences...</p>
                    </div>
                  ) : recommendations ? (
                    <div className="space-y-4">
                      <div className="bg-rutz-cream/20 p-4 rounded-lg">
                        <p className="text-sm text-rutz-forest">{recommendations.explanation}</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-rutz-gold mr-1" />
                          <span className="text-sm font-medium text-rutz-forest">
                            {Math.round(parseFloat(recommendations.confidenceScore) * 100)}% match confidence
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {recommendations.recommendedProducts?.slice(0, 3).map((rec, index) => {
                          const product = products.find(p => p.id === rec.productId);
                          if (!product) return null;

                          return (
                            <Card key={product.id} className="border border-rutz-gold/30">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-rutz-forest">{product.name}</h4>
                                    <p className="text-sm text-rutz-sage mb-2">{product.shortDescription}</p>
                                    <Badge variant="outline" className="text-xs border-rutz-gold">
                                      {Math.round(rec.score * 100)}% match
                                    </Badge>
                                    <p className="text-xs text-rutz-sage mt-1">{rec.reason}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-rutz-forest">${product.price}</div>
                                    <Button size="sm" className="bg-rutz-gold hover:bg-rutz-gold/90 mt-2">
                                      Add to Cart
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-rutz-sage">Unable to generate recommendations. Please try again.</p>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4 pt-6">
                    <Button variant="outline" onClick={resetQuestionnaire}>
                      Retake Quiz
                    </Button>
                    <Button onClick={() => setIsOpen(false)} className="bg-rutz-gold hover:bg-rutz-gold/90">
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}