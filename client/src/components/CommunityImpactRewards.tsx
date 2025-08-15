import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Trees, 
  GraduationCap, 
  Home, 
  Droplets,
  Award,
  Star,
  Gift,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  MapPin,
  Calendar,
  Zap,
  Coins,
  Crown,
  Trophy,
  Globe,
  Leaf
} from 'lucide-react';

interface CommunityProject {
  id: string;
  name: string;
  description: string;
  location: string;
  community: string;
  category: 'education' | 'infrastructure' | 'healthcare' | 'environment';
  status: 'planning' | 'active' | 'completed';
  progress: number;
  fundingGoal: string;
  currentFunding: string;
  startDate: string;
  targetCompletionDate?: string;
  completionDate?: string;
  beneficiaries: number;
  impactMetrics?: {
    treesPlanted?: number;
    peopleHelped?: number;
    waterAccessProvided?: number;
    educationHours?: number;
  };
}

interface UserContribution {
  id: string;
  userId: string;
  projectId: string;
  amount: string;
  contributionDate: string;
  type: 'purchase' | 'direct' | 'loyalty_points';
}

interface ImpactBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'environmental' | 'social' | 'educational' | 'cultural';
  requirement: {
    type: 'contribution_amount' | 'projects_supported' | 'impact_points' | 'streak_days';
    value: number;
    timeframe?: 'monthly' | 'yearly' | 'lifetime';
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  impactPoints: number;
  isActive: boolean;
}

interface UserImpactProfile {
  totalContributions: string;
  projectsSupported: number;
  impactPoints: number;
  impactLevel: number;
  currentStreak: number;
  longestStreak: number;
  badges: ImpactBadge[];
  rank: number;
  nextLevelProgress: number;
}

const categoryIcons = {
  education: GraduationCap,
  infrastructure: Home,
  healthcare: Heart,
  environment: Trees,
};

const categoryColors = {
  education: 'from-blue-500 to-indigo-600',
  infrastructure: 'from-gray-500 to-gray-700',
  healthcare: 'from-red-500 to-pink-600',
  environment: 'from-green-500 to-emerald-600',
};

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-500 to-indigo-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const CommunityImpactRewards: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(25);
  const [activeTab, setActiveTab] = useState('projects');
  const [impactAnimation, setImpactAnimation] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<CommunityProject[]>({
    queryKey: ['/api/community-projects'],
  });

  const { data: userProfile } = useQuery<UserImpactProfile>({
    queryKey: ['/api/user-impact-profile'],
  });

  // Mock impact profile for demonstration
  const mockProfile: UserImpactProfile = {
    totalContributions: '485.50',
    projectsSupported: 3,
    impactPoints: 1250,
    impactLevel: 4,
    currentStreak: 12,
    longestStreak: 25,
    badges: [],
    rank: 156,
    nextLevelProgress: 68,
  };

  const currentProfile = userProfile || mockProfile;

  const contributeMutation = useMutation({
    mutationFn: async ({ projectId, amount, type }: { 
      projectId: string; 
      amount: number; 
      type: 'direct' | 'loyalty_points' 
    }) => {
      const response = await fetch(`/api/community-projects/${projectId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type }),
      });
      if (!response.ok) throw new Error('Failed to contribute');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-impact-profile'] });
      setImpactAnimation(true);
      setTimeout(() => setImpactAnimation(false), 3000);
      toast({
        title: "Contribution Successful! 🌱",
        description: `Thank you! You earned ${data.impactPointsEarned} impact points.`,
      });
    },
  });

  const handleContribute = (project: CommunityProject, type: 'direct' | 'loyalty_points') => {
    contributeMutation.mutate({
      projectId: project.id,
      amount: contributionAmount,
      type,
    });
    setSelectedProject(null);
  };

  const getProjectProgress = (project: CommunityProject) => {
    const goal = parseFloat(project.fundingGoal);
    const current = parseFloat(project.currentFunding);
    return Math.min((current / goal) * 100, 100);
  };

  const getImpactLevelName = (level: number) => {
    const levels = ['Seedling', 'Sprout', 'Sapling', 'Tree', 'Forest Guardian', 'Earth Protector'];
    return levels[Math.min(level - 1, levels.length - 1)] || 'Guardian';
  };

  const getNextMilestone = () => {
    const nextLevels = [
      { level: 5, name: 'Forest Guardian', points: 1500 },
      { level: 6, name: 'Earth Protector', points: 2500 },
      { level: 7, name: 'Planet Healer', points: 5000 },
    ];
    
    return nextLevels.find(l => l.points > currentProfile.impactPoints);
  };

  const nextMilestone = getNextMilestone();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Impact Dashboard Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-forest">Community Impact Rewards</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Every purchase supports Indigenous communities and environmental conservation.
          Track your impact, earn rewards, and see the real difference you're making.
        </p>
      </motion.div>

      {/* User Impact Overview */}
      <Card className="bg-gradient-to-r from-forest via-sage to-emerald-600 text-white overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={impactAnimation ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}}
          transition={{ duration: 2 }}
        >
          <Trees className="w-full h-full object-cover" />
        </motion.div>
        
        <CardContent className="p-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ${currentProfile.totalContributions}
              </motion.div>
              <p className="text-cream/80">Total Contributions</p>
              <div className="flex items-center justify-center mt-2">
                <Heart className="w-4 h-4 mr-1" />
                <span className="text-sm">Thank you!</span>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                className="text-4xl font-bold mb-2 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-10 h-10 mr-2" />
                {currentProfile.impactLevel}
              </motion.div>
              <p className="text-cream/80">{getImpactLevelName(currentProfile.impactLevel)}</p>
              <p className="text-xs text-cream/60 mt-1">Impact Level</p>
            </div>

            <div className="text-center">
              <motion.div
                className="text-4xl font-bold mb-2"
                animate={{ color: ['#ffffff', '#fbbf24', '#ffffff'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentProfile.impactPoints}
              </motion.div>
              <p className="text-cream/80">Impact Points</p>
              <div className="flex items-center justify-center mt-2">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">Rank #{currentProfile.rank}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                🔥 {currentProfile.currentStreak}
              </div>
              <p className="text-cream/80">Day Streak</p>
              <p className="text-xs text-cream/60 mt-1">Best: {currentProfile.longestStreak} days</p>
            </div>
          </div>

          {/* Progress to Next Level */}
          {nextMilestone && (
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress to {nextMilestone.name}</span>
                <span className="text-sm">{currentProfile.impactPoints}/{nextMilestone.points} points</span>
              </div>
              <Progress 
                value={((currentProfile.impactPoints) / nextMilestone.points) * 100} 
                className="h-3 bg-white/20"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects" className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Active Projects
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            My Contributions
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Impact Badges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            Community Leaders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const CategoryIcon = categoryIcons[project.category];
              const progress = getProjectProgress(project);
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${categoryColors[project.category]} 
                          flex items-center justify-center text-white shadow-lg`}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.beneficiaries}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>${project.currentFunding}</span>
                          <span>${project.fundingGoal}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">{project.community}</p>
                        
                        {project.impactMetrics && (
                          <div className="flex flex-wrap gap-2">
                            {project.impactMetrics.treesPlanted && (
                              <Badge variant="outline" className="text-xs">
                                <Trees className="w-3 h-3 mr-1" />
                                {project.impactMetrics.treesPlanted} trees
                              </Badge>
                            )}
                            {project.impactMetrics.peopleHelped && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {project.impactMetrics.peopleHelped} helped
                              </Badge>
                            )}
                            {project.impactMetrics.waterAccessProvided && (
                              <Badge variant="outline" className="text-xs">
                                <Droplets className="w-3 h-3 mr-1" />
                                {project.impactMetrics.waterAccessProvided} L water
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedProject(project)}
                        disabled={project.status === 'completed'}
                        data-testid={`contribute-${project.id}`}
                      >
                        {project.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Support Project
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Impact History</CardTitle>
              <CardDescription>
                Track all your contributions and see the difference you've made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock contribution history */}
                {[
                  { project: 'Northern Ontario Clean Water Initiative', amount: '$75.00', date: '2024-08-10', impact: '+15 Impact Points' },
                  { project: 'Boreal Forest Conservation', amount: '$50.00', date: '2024-08-05', impact: '+10 Impact Points' },
                  { project: 'Traditional Medicine Education', amount: '$125.00', date: '2024-07-28', impact: '+25 Impact Points' },
                ].map((contribution, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="font-medium">{contribution.project}</p>
                      <p className="text-sm text-gray-600">{contribution.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-forest">{contribution.amount}</p>
                      <p className="text-sm text-green-600">{contribution.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Mock badges */}
            {[
              { name: 'First Impact', description: 'Made your first contribution', rarity: 'common', earned: true },
              { name: 'Tree Planter', description: 'Supported forest conservation', rarity: 'rare', earned: true },
              { name: 'Water Guardian', description: 'Provided clean water access', rarity: 'epic', earned: false },
              { name: 'Community Champion', description: 'Supported 10+ projects', rarity: 'legendary', earned: false },
            ].map((badge, index) => (
              <motion.div
                key={index}
                className={`text-center p-6 border rounded-lg ${badge.earned ? '' : 'opacity-60'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                  rarityColors[badge.rarity as keyof typeof rarityColors]
                } flex items-center justify-center shadow-lg`}>
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{badge.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                <Badge variant={badge.earned ? 'default' : 'outline'}>
                  {badge.earned ? 'Earned' : 'Locked'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impact Leaders</CardTitle>
              <CardDescription>
                Top contributors making a difference in Indigenous communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock leaderboard */}
                {[
                  { rank: 1, name: 'Maria S.', points: 5420, contributions: '$1,250', level: 'Earth Protector' },
                  { rank: 2, name: 'James M.', points: 4890, contributions: '$980', level: 'Forest Guardian' },
                  { rank: 3, name: 'You', points: currentProfile.impactPoints, contributions: `$${currentProfile.totalContributions}`, level: getImpactLevelName(currentProfile.impactLevel) },
                  { rank: 4, name: 'Sarah K.', points: 2340, contributions: '$485', level: 'Tree' },
                  { rank: 5, name: 'David L.', points: 2100, contributions: '$425', level: 'Tree' },
                ].map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === 'You' ? 'bg-forest/5 border-forest/20' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.level} • {user.contributions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-forest">{user.points} points</p>
                      {user.rank <= 3 && (
                        <Trophy className={`w-5 h-5 ml-auto ${
                          user.rank === 1 ? 'text-yellow-500' :
                          user.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contribution Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-lg w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Support {selectedProject.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  data-testid="close-contribution-modal"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedProject.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Current Progress</span>
                    <span>{Math.round(getProjectProgress(selectedProject))}%</span>
                  </div>
                  <Progress value={getProjectProgress(selectedProject)} />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${selectedProject.currentFunding} raised</span>
                    <span>${selectedProject.fundingGoal} goal</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Contribution Amount</label>
                  <div className="flex space-x-2">
                    {[10, 25, 50, 100].map((amount) => (
                      <Button
                        key={amount}
                        variant={contributionAmount === amount ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setContributionAmount(amount)}
                        data-testid={`amount-${amount}`}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                    min="1"
                    placeholder="Custom amount"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={() => handleContribute(selectedProject, 'direct')}
                    disabled={contributeMutation.isPending}
                    data-testid="contribute-direct"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Contribute ${contributionAmount}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleContribute(selectedProject, 'loyalty_points')}
                    disabled={contributeMutation.isPending}
                    data-testid="contribute-points"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Use Points
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  This contribution will earn you impact points and may unlock new badges
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityImpactRewards;