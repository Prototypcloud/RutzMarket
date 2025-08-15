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
  BookOpen, 
  Play, 
  Trophy, 
  Star, 
  Zap, 
  CheckCircle, 
  Lock,
  Clock,
  Target,
  Award,
  Brain,
  Leaf,
  Users,
  Video,
  FileText,
  HelpCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  plantMaterial: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xpReward: number;
  content: {
    sections: {
      title: string;
      type: 'text' | 'video' | 'quiz' | 'interactive';
      content: any;
    }[];
  };
  prerequisites: string[];
  isActive: boolean;
}

interface UserProgress {
  id: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpent: number;
  xpEarned: number;
  startedAt?: string;
  completedAt?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
  points: number;
}

const difficultyColors = {
  beginner: 'from-green-400 to-emerald-500',
  intermediate: 'from-blue-400 to-indigo-500',
  advanced: 'from-purple-400 to-violet-500',
};

const difficultyIcons = {
  beginner: Leaf,
  intermediate: Brain,
  advanced: Trophy,
};

const GamifiedLearningSystem: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({});
  const [showResults, setShowResults] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isLearning, setIsLearning] = useState(false);
  const [streakCount, setStreakCount] = useState(7); // Mock streak data

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modules = [] } = useQuery<LearningModule[]>({
    queryKey: ['/api/learning-modules'],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/user-learning-progress'],
  });

  const { data: quizQuestions = [] } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz-questions'],
  });

  const startModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch(`/api/learning-modules/${moduleId}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start module');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-learning-progress'] });
      toast({
        title: "Module Started!",
        description: "Your learning journey begins now.",
      });
    },
  });

  const completeModuleMutation = useMutation({
    mutationFn: async ({ moduleId, xpEarned }: { moduleId: string; xpEarned: number }) => {
      const response = await fetch(`/api/learning-modules/${moduleId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpEarned }),
      });
      if (!response.ok) throw new Error('Failed to complete module');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-learning-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-journey-progress'] });
      setEarnedXp(data.xpEarned);
      toast({
        title: "Module Completed! 🎉",
        description: `You earned ${data.xpEarned} XP! Keep learning!`,
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: { [key: string]: string }) => {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error('Failed to submit quiz');
      return response.json();
    },
    onSuccess: (results) => {
      setQuizResults(results.results);
      setShowResults(true);
      const score = Object.values(results.results).filter(Boolean).length;
      const totalQuestions = Object.keys(results.results).length;
      toast({
        title: `Quiz Complete!`,
        description: `You scored ${score}/${totalQuestions}! ${score === totalQuestions ? '🌟 Perfect score!' : 'Keep learning!'}`,
      });
    },
  });

  const getModuleProgress = (moduleId: string) => {
    return userProgress.find(p => p.moduleId === moduleId);
  };

  const getModuleStatus = (module: LearningModule) => {
    const progress = getModuleProgress(module.id);
    if (!progress) return 'not_started';
    return progress.status;
  };

  const canAccessModule = (module: LearningModule) => {
    if (module.prerequisites.length === 0) return true;
    return module.prerequisites.every(prereqId => {
      const prereqProgress = getModuleProgress(prereqId);
      return prereqProgress?.status === 'completed';
    });
  };

  const handleStartModule = (module: LearningModule) => {
    setSelectedModule(module);
    setCurrentSection(0);
    setIsLearning(true);
    
    if (getModuleStatus(module) === 'not_started') {
      startModuleMutation.mutate(module.id);
    }
  };

  const handleSectionComplete = () => {
    if (!selectedModule) return;
    
    if (currentSection < selectedModule.content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Module completed
      completeModuleMutation.mutate({
        moduleId: selectedModule.id,
        xpEarned: selectedModule.xpReward,
      });
      setIsLearning(false);
      setSelectedModule(null);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleQuizSubmit = () => {
    submitQuizMutation.mutate(quizAnswers);
  };

  const currentModuleQuestions = selectedModule ? 
    quizQuestions.filter(q => q.id.includes(selectedModule.plantMaterial.toLowerCase())) : [];

  const totalUserXp = userProgress.reduce((sum, progress) => sum + progress.xpEarned, 0);
  const completedModules = userProgress.filter(p => p.status === 'completed').length;
  const currentLevel = Math.floor(totalUserXp / 500) + 1;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Learning Dashboard Header */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6 text-center">
            <motion.div
              className="text-3xl font-bold mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {totalUserXp}
            </motion.div>
            <p className="text-purple-100">Total XP</p>
            <Zap className="w-6 h-6 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <motion.div
              className="text-3xl font-bold mb-2"
              animate={{ color: ['#ffffff', '#fbbf24', '#ffffff'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {currentLevel}
            </motion.div>
            <p className="text-green-100">Level</p>
            <Star className="w-6 h-6 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">{completedModules}</div>
            <p className="text-blue-100">Completed</p>
            <CheckCircle className="w-6 h-6 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <motion.div
              className="text-3xl font-bold mb-2 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
            >
              🔥 {streakCount}
            </motion.div>
            <p className="text-amber-100">Day Streak</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Content */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Modules
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {!isLearning ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {modules.map((module, index) => {
                const status = getModuleStatus(module);
                const canAccess = canAccessModule(module);
                const progress = getModuleProgress(module.id);
                const DifficultyIcon = difficultyIcons[module.difficulty];

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        !canAccess ? 'opacity-60 cursor-not-allowed' : ''
                      } ${status === 'completed' ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => canAccess && handleStartModule(module)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${difficultyColors[module.difficulty]} 
                            flex items-center justify-center text-white shadow-lg`}>
                            <DifficultyIcon className="w-6 h-6" />
                          </div>
                          <div className="flex items-center space-x-1">
                            {status === 'completed' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              </motion.div>
                            )}
                            {!canAccess && <Lock className="w-5 h-5 text-gray-400" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.estimatedTime} min
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1" />
                            {module.xpReward} XP
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {module.plantMaterial}
                          </Badge>
                          <Badge 
                            variant={module.difficulty === 'beginner' ? 'default' : 
                                   module.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {module.difficulty}
                          </Badge>
                        </div>

                        {progress && progress.status === 'in_progress' && (
                          <div className="space-y-2">
                            <Progress value={progress.progress} />
                            <p className="text-xs text-gray-500">{progress.progress}% complete</p>
                          </div>
                        )}

                        {canAccess ? (
                          <Button 
                            className="w-full" 
                            variant={status === 'completed' ? 'outline' : 'default'}
                            data-testid={`start-module-${module.id}`}
                          >
                            {status === 'completed' ? (
                              <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Review Module
                              </>
                            ) : status === 'in_progress' ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Continue Learning
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Learning
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button disabled className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Prerequisites
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Learning Interface */
            <AnimatePresence mode="wait">
              {selectedModule && (
                <motion.div
                  key={`${selectedModule.id}-${currentSection}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedModule.title}</CardTitle>
                          <CardDescription>
                            Section {currentSection + 1} of {selectedModule.content.sections.length}
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsLearning(false);
                            setSelectedModule(null);
                          }}
                          data-testid="exit-learning"
                        >
                          Exit
                        </Button>
                      </div>
                      <Progress 
                        value={((currentSection + 1) / selectedModule.content.sections.length) * 100} 
                        className="mt-4"
                      />
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardContent className="p-8">
                      {selectedModule.content.sections[currentSection] && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold">
                            {selectedModule.content.sections[currentSection].title}
                          </h3>
                          
                          {selectedModule.content.sections[currentSection].type === 'text' && (
                            <div className="prose max-w-none">
                              <p className="text-gray-700 leading-relaxed">
                                {selectedModule.content.sections[currentSection].content}
                              </p>
                            </div>
                          )}

                          {selectedModule.content.sections[currentSection].type === 'video' && (
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">
                                  {selectedModule.content.sections[currentSection].content}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedModule.content.sections[currentSection].type === 'quiz' && (
                            <div className="space-y-6">
                              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold text-blue-800 mb-2">Knowledge Check</h4>
                                <p className="text-blue-700 text-sm">
                                  Test your understanding of {selectedModule.plantMaterial} with these questions.
                                </p>
                              </div>

                              {currentModuleQuestions.map((question, qIndex) => (
                                <motion.div
                                  key={question.id}
                                  className="space-y-3 p-4 bg-white rounded-lg border"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: qIndex * 0.1 }}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                      {qIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium mb-3">{question.question}</h5>
                                      
                                      {question.type === 'multiple_choice' && question.options && (
                                        <div className="space-y-2">
                                          {question.options.map((option, optionIndex) => (
                                            <label 
                                              key={optionIndex}
                                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            >
                                              <input
                                                type="radio"
                                                name={question.id}
                                                value={option}
                                                onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                                                className="text-blue-500"
                                              />
                                              <span>{option}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}

                                      {question.type === 'true_false' && (
                                        <div className="space-y-2">
                                          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value="true"
                                              onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                                              className="text-blue-500"
                                            />
                                            <span>True</span>
                                          </label>
                                          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value="false"
                                              onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                                              className="text-blue-500"
                                            />
                                            <span>False</span>
                                          </label>
                                        </div>
                                      )}

                                      {showResults && quizResults[question.id] !== undefined && (
                                        <motion.div
                                          className={`mt-3 p-3 rounded-lg ${
                                            quizResults[question.id] 
                                              ? 'bg-green-50 border border-green-200' 
                                              : 'bg-red-50 border border-red-200'
                                          }`}
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                        >
                                          <div className="flex items-center space-x-2">
                                            {quizResults[question.id] ? (
                                              <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                              <HelpCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span className={`font-medium ${
                                              quizResults[question.id] ? 'text-green-800' : 'text-red-800'
                                            }`}>
                                              {quizResults[question.id] ? 'Correct!' : 'Incorrect'}
                                            </span>
                                          </div>
                                          {question.explanation && (
                                            <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                                          )}
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}

                              {!showResults && currentModuleQuestions.length > 0 && (
                                <Button 
                                  onClick={handleQuizSubmit}
                                  disabled={Object.keys(quizAnswers).length < currentModuleQuestions.length}
                                  className="w-full"
                                  data-testid="submit-quiz"
                                >
                                  Submit Quiz
                                </Button>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between pt-6">
                            <Button
                              variant="outline"
                              disabled={currentSection === 0}
                              onClick={() => setCurrentSection(currentSection - 1)}
                              data-testid="previous-section"
                            >
                              Previous
                            </Button>
                            
                            <Button
                              onClick={handleSectionComplete}
                              disabled={
                                selectedModule.content.sections[currentSection].type === 'quiz' && 
                                !showResults
                              }
                              data-testid="next-section"
                            >
                              {currentSection === selectedModule.content.sections.length - 1 ? (
                                <>
                                  Complete Module
                                  <Trophy className="w-4 h-4 ml-2" />
                                </>
                              ) : (
                                <>
                                  Next Section
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Unlock badges and rewards as you progress through your botanical learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mock achievements */}
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold">First Steps</h4>
                  <p className="text-sm text-gray-600">Complete your first learning module</p>
                  <Badge className="mt-2">Earned</Badge>
                </div>
                
                <div className="text-center p-4 border rounded-lg opacity-60">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="font-semibold">Knowledge Seeker</h4>
                  <p className="text-sm text-gray-600">Complete 5 learning modules</p>
                  <Badge variant="outline" className="mt-2">2/5</Badge>
                </div>
                
                <div className="text-center p-4 border rounded-lg opacity-60">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="font-semibold">Plant Master</h4>
                  <p className="text-sm text-gray-600">Complete all modules with perfect scores</p>
                  <Badge variant="outline" className="mt-2">Locked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>
                See how you rank among other botanical learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock leaderboard */}
                {[
                  { rank: 1, name: 'Sarah M.', xp: 3420, streak: 15 },
                  { rank: 2, name: 'Michael R.', xp: 2890, streak: 12 },
                  { rank: 3, name: 'You', xp: totalUserXp, streak: streakCount },
                  { rank: 4, name: 'Emma L.', xp: 2340, streak: 8 },
                  { rank: 5, name: 'David K.', xp: 2100, streak: 6 },
                ].map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === 'You' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.xp} XP • {user.streak} day streak</p>
                      </div>
                    </div>
                    {user.rank <= 3 && (
                      <Trophy className={`w-6 h-6 ${
                        user.rank === 1 ? 'text-yellow-500' :
                        user.rank === 2 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* XP Earned Animation */}
      <AnimatePresence>
        {earnedXp > 0 && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => setEarnedXp(0)}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-xl shadow-2xl text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Star className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-lg">You earned {earnedXp} XP!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamifiedLearningSystem;