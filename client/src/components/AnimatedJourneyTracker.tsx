import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Sprout, 
  Search, 
  BookOpen, 
  Crown, 
  Star, 
  Trophy, 
  Gift, 
  Zap,
  Heart,
  Leaf,
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  order: number;
  requirements: {
    minPurchases?: number;
    minLearningProgress?: number;
    minLoyaltyPoints?: number;
    requiredBadges?: string[];
  };
  rewards: {
    xp?: number;
    loyaltyPoints?: number;
    discount?: number;
    badgeId?: string;
  };
  iconUrl: string;
  colorScheme: string;
  isActive: boolean;
}

interface UserProgress {
  id: string;
  currentStageId: string;
  completedStages: string[];
  progressToNext: number;
  totalXp: number;
  level: number;
  lastUpdated: string;
}

const stageIcons = {
  Explorer: Sprout,
  Seeker: Search,
  Advocate: BookOpen,
  Guardian: Crown,
};

const AnimatedJourneyTracker: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const { data: stages = [] } = useQuery<JourneyStage[]>({
    queryKey: ['/api/journey-stages'],
  });

  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ['/api/user-journey-progress'],
  });

  // Mock user progress for demonstration
  const mockProgress: UserProgress = {
    id: '1',
    currentStageId: stages[1]?.id || '',
    completedStages: [stages[0]?.id || ''],
    progressToNext: 65,
    totalXp: 1250,
    level: 3,
    lastUpdated: new Date().toISOString(),
  };

  const currentProgress = userProgress || mockProgress;

  // Calculate stage status
  const getStageStatus = (stage: JourneyStage) => {
    if (currentProgress.completedStages.includes(stage.id)) {
      return 'completed';
    }
    if (stage.id === currentProgress.currentStageId) {
      return 'current';
    }
    const currentStageOrder = stages.find(s => s.id === currentProgress.currentStageId)?.order || 0;
    return stage.order <= currentStageOrder + 1 ? 'available' : 'locked';
  };

  // Animate progression
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStageColor = (stage: JourneyStage, status: string) => {
    const baseColors = {
      Explorer: 'from-green-400 to-emerald-500',
      Seeker: 'from-blue-400 to-indigo-500', 
      Advocate: 'from-purple-400 to-violet-500',
      Guardian: 'from-amber-400 to-orange-500',
    };

    if (status === 'completed') return 'from-green-500 to-emerald-600';
    if (status === 'current') return baseColors[stage.name as keyof typeof baseColors] || 'from-gray-400 to-gray-500';
    if (status === 'locked') return 'from-gray-300 to-gray-400';
    return 'from-gray-400 to-gray-500';
  };

  const getNextStageRequirements = () => {
    const currentStageIndex = stages.findIndex(s => s.id === currentProgress.currentStageId);
    const nextStage = stages[currentStageIndex + 1];
    
    if (!nextStage) return null;

    return {
      stage: nextStage,
      currentPurchases: 2, // Mock data
      currentLearningProgress: 45,
      currentLoyaltyPoints: 850,
    };
  };

  const nextRequirements = getNextStageRequirements();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-forest">Your Botanical Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Progress through the stages of botanical wisdom, from curious Explorer to knowledgeable Guardian.
          Each stage unlocks new benefits and deeper understanding of Indigenous plant medicine.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-forest to-sage text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Level {currentProgress.level}
              </motion.div>
              <p className="text-cream/80">Current Level</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 mr-2" />
                {currentProgress.totalXp}
              </motion.div>
              <p className="text-cream/80">Total Experience</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold"
                animate={{ color: ['#ffffff', '#fbbf24', '#ffffff'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentProgress.progressToNext}%
              </motion.div>
              <p className="text-cream/80">Progress to Next</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Stages */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-forest to-sage"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentProgress.completedStages.length + currentProgress.progressToNext/100) / stages.length) * 100}%` 
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 z-10">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage);
            const IconComponent = stageIcons[stage.name as keyof typeof stageIcons] || Leaf;
            
            return (
              <motion.div
                key={stage.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    status === 'current' ? 'ring-2 ring-forest shadow-lg' : ''
                  } ${status === 'locked' ? 'opacity-60' : ''}`}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => setSelectedStage(stage)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Stage Icon */}
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${getStageColor(stage, status)} 
                        flex items-center justify-center text-white shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                      animate={status === 'current' ? { 
                        boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 10px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <IconComponent className="w-8 h-8" />
                      {status === 'completed' && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.5 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      {status === 'locked' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.div>

                    {/* Stage Info */}
                    <h3 className="font-bold text-lg mb-2">{stage.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{stage.description}</p>

                    {/* Stage Progress */}
                    {status === 'current' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Progress value={currentProgress.progressToNext} className="mb-2" />
                        <p className="text-xs text-gray-500">{currentProgress.progressToNext}% Complete</p>
                      </motion.div>
                    )}

                    {/* Rewards Preview */}
                    {stage.rewards && (
                      <div className="flex justify-center space-x-2 mt-3">
                        {stage.rewards.xp && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {stage.rewards.xp} XP
                          </Badge>
                        )}
                        {stage.rewards.discount && (
                          <Badge variant="secondary" className="text-xs">
                            <Gift className="w-3 h-3 mr-1" />
                            {stage.rewards.discount}% Off
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Connecting Arrow */}
                {index < stages.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20"
                    animate={status === 'completed' ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight 
                      className={`w-6 h-6 ${
                        status === 'completed' ? 'text-green-500' : 'text-gray-400'
                      }`} 
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Stage Requirements */}
      {nextRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-amber-500" />
              Next: {nextRequirements.stage.name}
            </CardTitle>
            <CardDescription>
              Complete these requirements to advance to the next stage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextRequirements.stage.requirements.minPurchases && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Purchases</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(nextRequirements.currentPurchases / nextRequirements.stage.requirements.minPurchases) * 100} 
                    className="w-24" 
                  />
                  <span className="text-sm text-gray-600">
                    {nextRequirements.currentPurchases}/{nextRequirements.stage.requirements.minPurchases}
                  </span>
                </div>
              </div>
            )}
            
            {nextRequirements.stage.requirements.minLearningProgress && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Learning Progress</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={nextRequirements.currentLearningProgress} 
                    className="w-24" 
                  />
                  <span className="text-sm text-gray-600">
                    {nextRequirements.currentLearningProgress}%/{nextRequirements.stage.requirements.minLearningProgress}%
                  </span>
                </div>
              </div>
            )}

            {nextRequirements.stage.requirements.minLoyaltyPoints && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Loyalty Points</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(nextRequirements.currentLoyaltyPoints / nextRequirements.stage.requirements.minLoyaltyPoints) * 100} 
                    className="w-24" 
                  />
                  <span className="text-sm text-gray-600">
                    {nextRequirements.currentLoyaltyPoints}/{nextRequirements.stage.requirements.minLoyaltyPoints}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage Details Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStage(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedStage.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStage(null)}
                  data-testid="close-stage-details"
                >
                  ✕
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedStage.description}</p>
              
              {selectedStage.requirements && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">Requirements:</h4>
                  {Object.entries(selectedStage.requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedStage.rewards && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Rewards:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedStage.rewards).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key === 'xp' && <Zap className="w-3 h-3 mr-1" />}
                        {key === 'loyaltyPoints' && <Star className="w-3 h-3 mr-1" />}
                        {key === 'discount' && <Gift className="w-3 h-3 mr-1" />}
                        {value}{key === 'discount' ? '%' : ''} {key.replace(/([A-Z])/g, ' $1')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedJourneyTracker;