import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Sparkles, Target, Heart, Zap, Shield, Users, Star } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UserPreferences {
  primaryGoals: string[];
  healthConcerns: string[];
  lifestyle: string;
  experienceLevel: string;
  preferredFormats: string[];
  budgetRange: string;
  timeCommitment: string;
  personalityProfile: string;
}

interface PlantRecommendation {
  productId: string;
  productName: string;
  plantName: string;
  confidenceScore: number;
  matchReason: string;
  benefits: string[];
  dosageRecommendation: string;
  synergies: string[];
  precautions: string[];
  traditionalUse: string;
  scientificBacking: string;
  price: number;
  format: string;
}

interface PairingRecommendation {
  id: string;
  name: string;
  description: string;
  plants: PlantRecommendation[];
  totalConfidence: number;
  synergyExplanation: string;
  expectedBenefits: string[];
  timeline: string;
  adaptationNotes: string;
}

const healthGoals = [
  { id: "immune", label: "Immune Support", icon: <Shield className="w-4 h-4" /> },
  { id: "energy", label: "Energy & Vitality", icon: <Zap className="w-4 h-4" /> },
  { id: "stress", label: "Stress Management", icon: <Heart className="w-4 h-4" /> },
  { id: "focus", label: "Mental Clarity", icon: <Brain className="w-4 h-4" /> },
  { id: "sleep", label: "Sleep Quality", icon: <Target className="w-4 h-4" /> },
  { id: "digestive", label: "Digestive Health", icon: <Heart className="w-4 h-4" /> },
  { id: "inflammation", label: "Anti-inflammatory", icon: <Shield className="w-4 h-4" /> },
  { id: "adaptogen", label: "Adaptogenic Support", icon: <Sparkles className="w-4 h-4" /> }
];

const lifestyleOptions = [
  { value: "active", label: "Very Active" },
  { value: "moderate", label: "Moderately Active" },
  { value: "sedentary", label: "Sedentary" },
  { value: "variable", label: "Variable Activity" }
];

const experienceLevels = [
  { value: "beginner", label: "New to Botanical Extracts" },
  { value: "intermediate", label: "Some Experience" },
  { value: "advanced", label: "Very Experienced" },
  { value: "expert", label: "Expert Knowledge" }
];

const formatPreferences = [
  { id: "tincture", label: "Liquid Tinctures" },
  { id: "powder", label: "Powdered Extracts" },
  { id: "capsule", label: "Capsules" },
  { id: "tea", label: "Herbal Teas" },
  { id: "topical", label: "Topical Applications" }
];

export default function PlantPairing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    primaryGoals: [],
    healthConcerns: [],
    lifestyle: "",
    experienceLevel: "",
    preferredFormats: [],
    budgetRange: "",
    timeCommitment: "",
    personalityProfile: ""
  });

  const { toast } = useToast();

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs)
      });
      if (!response.ok) throw new Error("Failed to generate recommendations");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recommendations Generated",
        description: "Your personalized plant pairings are ready!"
      });
      setCurrentStep(4);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    }
  });

  const { data: recommendations } = useQuery<PairingRecommendation[]>({
    queryKey: ["/api/recommendations"],
    enabled: currentStep === 4
  });

  const handleGoalToggle = (goalId: string) => {
    setPreferences(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter(g => g !== goalId)
        : [...prev.primaryGoals, goalId]
    }));
  };

  const handleFormatToggle = (formatId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredFormats: prev.preferredFormats.includes(formatId)
        ? prev.preferredFormats.filter(f => f !== formatId)
        : [...prev.preferredFormats, formatId]
    }));
  };

  const generateRecommendations = () => {
    generateRecommendationsMutation.mutate(preferences);
  };

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest to-sage text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Plant Pairing
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Discover your perfect botanical combinations using advanced AI and traditional wisdom
            </p>
            <Badge className="bg-cream text-forest px-6 py-2 text-lg">
              <Brain className="w-5 h-5 mr-2" />
              Personalized • Scientific • Traditional
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-24 mx-4 ${
                    currentStep > step ? 'bg-forest' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-forest">
              {currentStep === 1 && "Health Goals & Preferences"}
              {currentStep === 2 && "Lifestyle & Experience"}
              {currentStep === 3 && "Personal Profile"}
              {currentStep === 4 && "Your Recommendations"}
            </h3>
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-forest">
                    What are your primary health goals?
                  </CardTitle>
                  <CardDescription>
                    Select all that apply. Our AI will find the perfect plant combinations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {healthGoals.map((goal) => (
                      <div key={goal.id}>
                        <Button
                          variant={preferences.primaryGoals.includes(goal.id) ? "default" : "outline"}
                          className={`w-full h-20 flex flex-col items-center justify-center space-y-2 ${
                            preferences.primaryGoals.includes(goal.id) 
                              ? 'bg-forest text-white' 
                              : 'border-forest text-forest hover:bg-forest hover:text-white'
                          }`}
                          onClick={() => handleGoalToggle(goal.id)}
                          data-testid={`goal-${goal.id}`}
                        >
                          {goal.icon}
                          <span className="text-xs text-center">{goal.label}</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="health-concerns" className="text-forest font-medium">
                      Any specific health concerns or conditions? (Optional)
                    </Label>
                    <Textarea
                      id="health-concerns"
                      placeholder="e.g., high stress job, poor sleep, digestive issues..."
                      className="mt-2"
                      value={preferences.healthConcerns.join(', ')}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        healthConcerns: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      data-testid="health-concerns-input"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={preferences.primaryGoals.length === 0}
                      className="bg-forest text-white"
                      data-testid="next-step-1"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-forest">
                    Tell us about your lifestyle
                  </CardTitle>
                  <CardDescription>
                    This helps us recommend the right dosages and formats.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-forest font-medium">Activity Level</Label>
                    <Select 
                      value={preferences.lifestyle} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, lifestyle: value }))}
                    >
                      <SelectTrigger className="mt-2" data-testid="lifestyle-select">
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        {lifestyleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Experience with Botanical Extracts</Label>
                    <Select 
                      value={preferences.experienceLevel} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, experienceLevel: value }))}
                    >
                      <SelectTrigger className="mt-2" data-testid="experience-select">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Preferred Product Formats</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {formatPreferences.map((format) => (
                        <div key={format.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={format.id}
                            checked={preferences.preferredFormats.includes(format.id)}
                            onCheckedChange={() => handleFormatToggle(format.id)}
                            data-testid={`format-${format.id}`}
                          />
                          <Label htmlFor={format.id} className="text-sm">
                            {format.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Budget Range (CAD per month)</Label>
                    <Select 
                      value={preferences.budgetRange} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, budgetRange: value }))}
                    >
                      <SelectTrigger className="mt-2" data-testid="budget-select">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="200-300">$200 - $300</SelectItem>
                        <SelectItem value="300+">$300+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      data-testid="back-step-2"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!preferences.lifestyle || !preferences.experienceLevel}
                      className="bg-forest text-white"
                      data-testid="next-step-2"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-forest">
                    Personal Wellness Profile
                  </CardTitle>
                  <CardDescription>
                    Help us understand your approach to wellness for better recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-forest font-medium">Time Commitment</Label>
                    <Select 
                      value={preferences.timeCommitment} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, timeCommitment: value }))}
                    >
                      <SelectTrigger className="mt-2" data-testid="time-select">
                        <SelectValue placeholder="How much time can you dedicate daily?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (5 minutes)</SelectItem>
                        <SelectItem value="moderate">Moderate (15 minutes)</SelectItem>
                        <SelectItem value="dedicated">Dedicated (30+ minutes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="personality" className="text-forest font-medium">
                      Wellness Personality
                    </Label>
                    <Select 
                      value={preferences.personalityProfile} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, personalityProfile: value }))}
                    >
                      <SelectTrigger className="mt-2" data-testid="personality-select">
                        <SelectValue placeholder="Which describes your approach?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="methodical">Methodical - I like precise schedules</SelectItem>
                        <SelectItem value="intuitive">Intuitive - I listen to my body</SelectItem>
                        <SelectItem value="experimental">Experimental - I enjoy trying new things</SelectItem>
                        <SelectItem value="traditional">Traditional - I prefer proven methods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                      data-testid="back-step-3"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={generateRecommendations}
                      disabled={!preferences.timeCommitment || !preferences.personalityProfile || generateRecommendationsMutation.isPending}
                      className="bg-forest text-white"
                      data-testid="generate-recommendations"
                    >
                      {generateRecommendationsMutation.isPending ? "Generating..." : "Generate My Recommendations"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-forest mb-4">
                    Your Personalized Plant Pairings
                  </h2>
                  <p className="text-lg text-gray-600">
                    Based on your preferences, here are your optimal botanical combinations
                  </p>
                </div>

                {recommendations.map((pairing, index) => (
                  <Card key={pairing.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-forest to-sage text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{pairing.name}</CardTitle>
                          <CardDescription className="text-cream">
                            {pairing.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.round(pairing.totalConfidence / 20) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-cream">
                            {pairing.totalConfidence}% Match
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Synergy Explanation */}
                        <div>
                          <h4 className="font-semibold text-forest mb-2">Why This Combination Works</h4>
                          <p className="text-gray-700">{pairing.synergyExplanation}</p>
                        </div>

                        {/* Plant Details */}
                        <div>
                          <h4 className="font-semibold text-forest mb-4">Plant Breakdown</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pairing.plants.map((plant) => (
                              <Card key={plant.productId} className="border-l-4 border-l-forest">
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-lg text-forest">
                                        {plant.plantName}
                                      </CardTitle>
                                      <CardDescription>{plant.productName}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-forest border-forest">
                                      {plant.confidenceScore}% Match
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="space-y-3">
                                    <div>
                                      <span className="font-medium text-forest">Why for you: </span>
                                      <span className="text-gray-700">{plant.matchReason}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-forest">Benefits: </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {plant.benefits.map((benefit) => (
                                          <Badge key={benefit} variant="secondary" className="text-xs">
                                            {benefit}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-forest">Recommended dose: </span>
                                      <span className="text-gray-700">{plant.dosageRecommendation}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      <strong>Traditional use:</strong> {plant.traditionalUse}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Expected Benefits */}
                        <div>
                          <h4 className="font-semibold text-forest mb-2">Expected Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {pairing.expectedBenefits.map((benefit) => (
                              <Badge key={benefit} className="bg-cream text-forest">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Timeline & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-forest mb-2">Expected Timeline</h4>
                            <p className="text-gray-700">{pairing.timeline}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-forest mb-2">Adaptation Notes</h4>
                            <p className="text-gray-700">{pairing.adaptationNotes}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center">
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="mr-4"
                    data-testid="start-over"
                  >
                    Start Over
                  </Button>
                  <Button 
                    className="bg-forest text-white"
                    data-testid="save-recommendations"
                  >
                    Save My Recommendations
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}