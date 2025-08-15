import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Target, Clock, CheckCircle, AlertCircle, TrendingUp, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommunityProject {
  id: string;
  name: string;
  description: string;
  location: string;
  community: string;
  category: string;
  status: string;
  progress: number;
  fundingGoal: string;
  currentFunding: string;
  startDate: string;
  targetCompletionDate: string;
  completionDate: string | null;
  beneficiaries: number;
  createdAt: string;
  lastUpdated: string;
}

interface LiveUpdate {
  id: string;
  projectId: string;
  updateType: string;
  title: string;
  description: string;
  previousValue: string | null;
  newValue: string | null;
  impactMetric: string | null;
  isPublic: boolean;
  createdAt: string;
}

interface ImpactMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  achievedDate: string | null;
  isAchieved: boolean;
  celebrationMessage: string | null;
  impactValue: number;
  createdAt: string;
}

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'active': return 'bg-blue-500';
    case 'planning': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'education': return Users;
    case 'healthcare': return Heart;
    case 'environment': return Target;
    case 'infrastructure': return MapPin;
    default: return Target;
  }
};

const getUpdateTypeColor = (type: string) => {
  switch (type) {
    case 'completion': return 'bg-green-100 text-green-800 border-green-200';
    case 'progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'funding': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'milestone': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function CommunityImpactTracker() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: projects = [], isLoading: projectsLoading } = useQuery<CommunityProject[]>({
    queryKey: ['/api/community-projects'],
  });

  const { data: liveUpdates = [], isLoading: updatesLoading } = useQuery<LiveUpdate[]>({
    queryKey: ['/api/live-updates'],
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery<ImpactMilestone[]>({
    queryKey: ['/api/impact-milestones'],
  });

  // Auto-select the most recently updated project
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const projectMilestones = milestones.filter(m => m.projectId === selectedProject);
  const recentUpdates = liveUpdates.slice(0, 8);

  if (projectsLoading || updatesLoading || milestonesLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="community-impact-tracker">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Live Community Impact
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time updates from our indigenous partnership projects across Canada
          </p>
        </motion.div>

        {/* Live indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Live Updates
          </span>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects" data-testid="tab-projects">
            <Target className="w-4 h-4 mr-2" />
            Active Projects
          </TabsTrigger>
          <TabsTrigger value="updates" data-testid="tab-updates">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Updates
          </TabsTrigger>
          <TabsTrigger value="milestones" data-testid="tab-milestones">
            <CheckCircle className="w-4 h-4 mr-2" />
            Milestones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Project Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const CategoryIcon = getCategoryIcon(project.category);
              const fundingPercentage = (parseFloat(project.currentFunding) / parseFloat(project.fundingGoal)) * 100;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-200 ${
                      selectedProject === project.id 
                        ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                    data-testid={`project-card-${project.id}`}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <CategoryIcon className="w-8 h-8 text-green-600" />
                        <Badge 
                          className={`${getStatusColor(project.status)} text-white`}
                          data-testid={`project-status-${project.id}`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {project.community}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          className="h-2"
                          data-testid={`project-progress-${project.id}`}
                        />
                      </div>

                      {/* Funding */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Funding</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {fundingPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={fundingPercentage} 
                          className="h-2"
                          data-testid={`project-funding-${project.id}`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatCurrency(project.currentFunding)}</span>
                          <span>{formatCurrency(project.fundingGoal)}</span>
                        </div>
                      </div>

                      {/* Beneficiaries */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Users className="w-4 h-4 mr-1" />
                          Beneficiaries
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {project.beneficiaries.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Project Details */}
          {selectedProjectData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span>Project Focus: {selectedProjectData.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Timeline
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Started: {formatDate(selectedProjectData.startDate)}</div>
                      <div>Target: {formatDate(selectedProjectData.targetCompletionDate)}</div>
                      {selectedProjectData.completionDate && (
                        <div className="text-green-600 font-medium">
                          Completed: {formatDate(selectedProjectData.completionDate)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location & Community
                    </div>
                    <div className="text-sm space-y-1">
                      <div>{selectedProjectData.location}</div>
                      <div className="font-medium">{selectedProjectData.community}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 mr-2" />
                      Impact
                    </div>
                    <div className="text-sm space-y-1">
                      <div>{selectedProjectData.beneficiaries} people served</div>
                      <div className="capitalize">{selectedProjectData.category} focus</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <AnimatePresence>
            {recentUpdates.map((update, index) => {
              const relatedProject = projects.find(p => p.id === update.projectId);
              
              return (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-l-4 border-l-green-500" data-testid={`update-${update.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getUpdateTypeColor(update.updateType)} border`}>
                              {update.updateType}
                            </Badge>
                            {relatedProject && (
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {relatedProject.name}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {update.title}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {update.description}
                          </p>
                          {update.previousValue && update.newValue && (
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-500">
                                {update.previousValue}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-green-600">
                                {update.newValue}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(update.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {milestones.map((milestone, index) => {
            const relatedProject = projects.find(p => p.id === milestone.projectId);
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`${milestone.isAchieved ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : ''}`}
                  data-testid={`milestone-${milestone.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.isAchieved ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.isAchieved ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {milestone.title}
                          </h4>
                          {relatedProject && (
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {relatedProject.name}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {milestone.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="space-x-4">
                            <span className="text-gray-600 dark:text-gray-300">
                              Target: {formatDate(milestone.targetDate)}
                            </span>
                            {milestone.achievedDate && (
                              <span className="text-green-600 font-medium">
                                Achieved: {formatDate(milestone.achievedDate)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {milestone.impactValue}% value
                          </span>
                        </div>
                        
                        {milestone.celebrationMessage && (
                          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
                            <p className="text-sm text-green-800 dark:text-green-200 italic">
                              🎉 {milestone.celebrationMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}