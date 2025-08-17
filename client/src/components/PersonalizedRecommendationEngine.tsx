import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Target, 
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Leaf,
  Moon,
  Sun,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  ArrowRight,
  ShoppingCart,
  Bookmark,
  Plus,
  X
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface Product {
  id: string;
  name: string;
  plantMaterial: string;
  scientificName: string;
  shortDescription: string;
  price: string;
  category: string;
  sector: string;
  bioactiveCompounds: string[];
  traditionalUse?: string;
  rating: string;
  imageUrl: string;
  origin: string;
}

interface UserPreferences {
  healthGoals: string[];
  currentConditions: string[];
  lifestyle: {
    activityLevel: 'sedentary' | 'moderate' | 'active' | 'very_active';
    stressLevel: number; // 1-10
    sleepQuality: number; // 1-10
    dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'paleo' | 'keto';
  };
  preferences: {
    formats: string[];
    budgetRange: [number, number];
    timeCommitment: 'minimal' | 'moderate' | 'dedicated';
    naturalness: number; // 1-10 preference for natural vs processed
  };
  restrictions: string[];
  currentSupplements: string[];
}

interface PlantRecommendation {
  product: Product;
  confidenceScore: number;
  matchReasons: string[];
  synergies: {
    plantMaterial: string;
    reason: string;
    strength: number;
  }[];
  traditionalWisdom: string;
  modernScience: string;
  dosageGuidance: string;
  timingRecommendation: string;
  expectedBenefits: string[];
  precautions: string[];
  personalizedNotes: string[];
}

interface RecommendationSet {
  id: string;
  name: string;
  description: string;
  recommendations: PlantRecommendation[];
  totalConfidence: number;
  expectedOutcomes: string[];
  timelineExpectation: string;
  type: 'daily_routine' | 'targeted_support' | 'seasonal_adaptation' | 'stress_response';
}

const healthGoalIcons = {
  'immune_support': Shield,
  'energy_vitality': Zap,
  'stress_management': Heart,
  'mental_clarity': Brain,
  'sleep_quality': Moon,
  'digestive_health': Activity,
  'anti_inflammatory': Thermometer,
  'respiratory_health': Wind,
  'skin_health': Sun,
  'joint_mobility': Target,
};

interface ConcernContext {
  name: string;
  description: string;
  keywords: string[];
  color: string;
}

interface PersonalizedRecommendationEngineProps {
  concernContext?: ConcernContext | null;
}

const PersonalizedRecommendationEngine: React.FC<PersonalizedRecommendationEngineProps> = ({ concernContext }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<PlantRecommendation | null>(null);
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [preferencesStep, setPreferencesStep] = useState(1);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: recommendationSets = [] } = useQuery<RecommendationSet[]>({
    queryKey: ['/api/personalized-recommendations'],
    enabled: !!userPreferences,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      setIsAnalyzing(true);
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch('/api/ai-recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error('Failed to generate recommendations');
      return response.json();
    },
    onSuccess: () => {
      setIsAnalyzing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/personalized-recommendations'] });
      toast({
        title: "Recommendations Generated! 🌱",
        description: "Your personalized plant medicine recommendations are ready.",
      });
      setActiveStep(3);
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const saveRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      const response = await fetch(`/api/recommendations/${recommendationId}/save`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to save recommendation');
      return response.json();
    },
    onSuccess: (_, recommendationId) => {
      setSavedRecommendations(prev => [...prev, recommendationId]);
      toast({
        title: "Recommendation Saved",
        description: "Added to your plant medicine library.",
      });
    },
  });

  // Mock user preferences for demonstration
  const mockPreferences: UserPreferences = {
    healthGoals: ['stress_management', 'energy_vitality', 'immune_support'],
    currentConditions: ['occasional_anxiety', 'low_energy'],
    lifestyle: {
      activityLevel: 'moderate',
      stressLevel: 6,
      sleepQuality: 4,
      dietType: 'omnivore',
    },
    preferences: {
      formats: ['tea', 'powder', 'capsules'],
      budgetRange: [30, 100],
      timeCommitment: 'moderate',
      naturalness: 8,
    },
    restrictions: [],
    currentSupplements: [],
  };

  // Mock recommendation sets for demonstration
  const mockRecommendationSets: RecommendationSet[] = [
    {
      id: 'stress-support',
      name: 'Stress Support Protocol',
      description: 'Traditional Canadian plants for stress management and emotional balance',
      type: 'targeted_support',
      totalConfidence: 92,
      expectedOutcomes: ['Reduced stress levels', 'Better emotional balance', 'Improved sleep quality'],
      timelineExpectation: '2-4 weeks for noticeable effects',
      recommendations: products.slice(0, 3).map((product, index) => ({
        product,
        confidenceScore: 85 + index * 3,
        matchReasons: [
          'Traditional use for stress relief',
          'Matches your lifestyle preferences',
          'Compatible with your current routine'
        ],
        synergies: [
          {
            plantMaterial: 'Wild Rose',
            reason: 'Vitamin C supports stress response',
            strength: 0.8
          }
        ],
        traditionalWisdom: 'Used by Indigenous communities for calming and grounding',
        modernScience: 'Contains compounds that support healthy cortisol levels',
        dosageGuidance: 'Start with 1/2 teaspoon daily, increase gradually',
        timingRecommendation: 'Best taken in the evening',
        expectedBenefits: ['Stress reduction', 'Improved sleep', 'Enhanced mood'],
        precautions: ['Start with small amounts', 'Consult healthcare provider if pregnant'],
        personalizedNotes: ['Perfect match for your stress management goals']
      }))
    }
  ];

  const currentRecommendations = recommendationSets.length > 0 ? recommendationSets : mockRecommendationSets;

  const handleStartAnalysis = () => {
    if (!userPreferences) {
      setUserPreferences(mockPreferences);
    }
    generateRecommendationsMutation.mutate(userPreferences || mockPreferences);
    setActiveStep(2);
  };

  const PreferenceSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Step {preferencesStep}: Health Goals</CardTitle>
          <CardDescription>
            What are your primary health and wellness goals?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferencesStep === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(healthGoalIcons).map(([goal, Icon]) => (
                <motion.div
                  key={goal}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-forest" />
                  <p className="text-sm font-medium capitalize">
                    {goal.replace(/_/g, ' ')}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {preferencesStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Sedentary', 'Moderate', 'Active', 'Very Active'].map((level) => (
                    <Button
                      key={level}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stress Level (1-10): <span className="font-normal">6</span>
                </label>
                <Slider
                  value={[6]}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sleep Quality (1-10): <span className="font-normal">4</span>
                </label>
                <Slider
                  value={[4]}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {preferencesStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Formats</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Herbal Teas', 'Powder Extracts', 'Capsules', 'Tinctures', 'Essential Oils'].map((format) => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget Range: $30 - $100 per month
                </label>
                <Slider
                  value={[30, 100]}
                  max={200}
                  step={10}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preference for Natural Products (1-10): <span className="font-normal">8</span>
                </label>
                <Slider
                  value={[8]}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              disabled={preferencesStep === 1}
              onClick={() => setPreferencesStep(preferencesStep - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (preferencesStep === 3) {
                  setUserPreferences(mockPreferences);
                  setActiveStep(2);
                  handleStartAnalysis();
                } else {
                  setPreferencesStep(preferencesStep + 1);
                }
              }}
            >
              {preferencesStep === 3 ? 'Generate Recommendations' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const AnalysisStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center space-y-6"
    >
      <Card>
        <CardContent className="p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <Brain className="w-full h-full text-forest" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-4">Analyzing Your Profile</h3>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing thousands of traditional plant combinations and modern research 
            to create your personalized recommendations.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Processing health goals</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Analyzing lifestyle factors</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Matching Indigenous plant wisdom</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Validating with modern science</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <Progress value={65} className="mt-6" />
          <p className="text-xs text-gray-500 mt-2">This may take a few moments...</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const RecommendationsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-forest">Your Personalized Recommendations</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your unique profile, here are plant medicine recommendations combining 
          traditional Indigenous wisdom with modern scientific validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentRecommendations.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{set.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {set.totalConfidence}% match
                  </Badge>
                </div>
                <CardDescription>{set.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Recommended Plants:</h5>
                  <div className="space-y-2">
                    {set.recommendations.slice(0, 3).map((rec, recIndex) => (
                      <motion.div
                        key={recIndex}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedRecommendation(rec)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {recIndex + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{rec.product.plantMaterial}</p>
                            <p className="text-xs text-gray-600">{rec.product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600 font-medium">
                            {rec.confidenceScore}% match
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Expected Outcomes:</h5>
                  <div className="flex flex-wrap gap-1">
                    {set.expectedOutcomes.map((outcome, outcomeIndex) => (
                      <Badge key={outcomeIndex} variant="outline" className="text-xs">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Timeline: {set.timelineExpectation}</span>
                  <Button 
                    size="sm"
                    onClick={() => saveRecommendationMutation.mutate(set.id)}
                    disabled={savedRecommendations.includes(set.id)}
                    data-testid={`save-recommendation-${set.id}`}
                  >
                    {savedRecommendations.includes(set.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button 
          variant="outline"
          onClick={() => {
            setActiveStep(1);
            setPreferencesStep(1);
            setUserPreferences(null);
          }}
          data-testid="new-analysis"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* RÜTZ Logo */}
      <div className="flex justify-center mb-6">
        <Logo size="md" />
      </div>
      
      {/* Progress Header */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
              activeStep >= step 
                ? 'bg-forest text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {activeStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-1 ${
                activeStep > step ? 'bg-forest' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {activeStep === 1 && <PreferenceSetupStep />}
        {activeStep === 2 && isAnalyzing && <AnalysisStep />}
        {activeStep === 3 && <RecommendationsStep />}
      </AnimatePresence>

      {/* Plant Details Modal */}
      <AnimatePresence>
        {selectedRecommendation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecommendation(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{selectedRecommendation.product.plantMaterial}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecommendation(null)}
                    data-testid="close-plant-details"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img
                      src={selectedRecommendation.product.imageUrl}
                      alt={selectedRecommendation.product.plantMaterial}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Match Score</h4>
                      <div className="flex items-center space-x-2">
                        <Progress value={selectedRecommendation.confidenceScore} className="flex-1" />
                        <span className="font-bold text-forest">
                          {selectedRecommendation.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Why This Matches You</h4>
                      <div className="space-y-1">
                        {selectedRecommendation.matchReasons.map((reason, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Traditional Wisdom</h4>
                      <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                        {selectedRecommendation.traditionalWisdom}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Modern Science</h4>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        {selectedRecommendation.modernScience}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Usage Guidance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-forest" />
                          <span><strong>Dosage:</strong> {selectedRecommendation.dosageGuidance}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-forest" />
                          <span><strong>Timing:</strong> {selectedRecommendation.timingRecommendation}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Expected Benefits</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRecommendation.expectedBenefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedRecommendation.precautions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                          Precautions
                        </h4>
                        <div className="space-y-1">
                          {selectedRecommendation.precautions.map((precaution, index) => (
                            <p key={index} className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                              {precaution}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button className="flex-1" data-testid="add-to-cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart - ${selectedRecommendation.product.price}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => saveRecommendationMutation.mutate('individual-' + selectedRecommendation.product.id)}
                    data-testid="save-individual"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizedRecommendationEngine;