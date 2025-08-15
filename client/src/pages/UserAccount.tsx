import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Trophy, Package, GraduationCap, Heart, Star, Calendar, MapPin, Mail, Phone } from "lucide-react";
import type { User as UserType, Order, UserBadge, Badge as BadgeType, UserLearningProgress, LearningModule, UserJourneyProgress } from "@shared/schema";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export default function UserAccount() {
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  // Mock user ID for demo - in real app this would come from auth
  const userId = "demo-user";

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", userId],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/users", userId, "orders"],
  });

  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ["/api/users", userId, "badges"],
  });

  const { data: learningProgress, isLoading: learningLoading } = useQuery({
    queryKey: ["/api/users", userId, "learning"],
  });

  const { data: journeyProgress, isLoading: journeyLoading } = useQuery({
    queryKey: ["/api/users", userId, "journey"],
  });

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      return apiRequest(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
    },
  });

  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(data);
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" data-testid="user-account-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
          My Account
        </h1>
        <p className="text-gray-600 dark:text-gray-300" data-testid="page-description">
          Manage your profile, view orders, and track your botanical journey
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card data-testid="stat-orders">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-badges">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{badges?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-loyalty">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Loyalty Points</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.loyaltyPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-level">
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{journeyProgress?.level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-testid="account-tabs">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          <TabsTrigger value="learning" data-testid="tab-learning">Learning</TabsTrigger>
          <TabsTrigger value="badges" data-testid="tab-badges">Achievements</TabsTrigger>
          <TabsTrigger value="journey" data-testid="tab-journey">Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6" data-testid="profile-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="profile-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6" data-testid="orders-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2" />
                Order History
              </CardTitle>
              <CardDescription>View your past purchases and order status</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-8" data-testid="no-orders">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <p className="text-sm text-gray-400">Start your botanical journey by making your first purchase</p>
                </div>
              ) : (
                <div className="space-y-4" data-testid="orders-list">
                  {orders?.map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4" data-testid={`order-${order.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold">${parseFloat(order.total).toFixed(2)}</p>
                        <Button variant="outline" size="sm" data-testid={`button-view-order-${order.id}`}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6" data-testid="learning-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2" />
                Learning Progress
              </CardTitle>
              <CardDescription>Track your botanical education journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{user?.learningProgress || 0}%</span>
                </div>
                <Progress value={user?.learningProgress || 0} className="h-2" data-testid="learning-progress" />
              </div>
              
              {learningLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : learningProgress?.length === 0 ? (
                <div className="text-center py-8" data-testid="no-learning">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No learning modules started yet</p>
                  <Button className="mt-4" data-testid="button-start-learning">
                    Explore Learning Modules
                  </Button>
                </div>
              ) : (
                <div className="space-y-4" data-testid="learning-modules">
                  {learningProgress?.map((progress: UserLearningProgress & { module: LearningModule }) => (
                    <div key={progress.id} className="border rounded-lg p-4" data-testid={`module-${progress.moduleId}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{progress.module?.title}</p>
                          <p className="text-sm text-gray-600">{progress.module?.plantMaterial}</p>
                        </div>
                        <Badge variant={progress.status === "completed" ? "default" : "secondary"}>
                          {progress.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Progress value={progress.progress} className="flex-1 mr-4" />
                        <span className="text-sm font-medium">{progress.progress}%</span>
                      </div>
                      {progress.xpEarned > 0 && (
                        <p className="text-sm text-green-600 mt-2">+{progress.xpEarned} XP earned</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6" data-testid="badges-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2" />
                Achievements & Badges
              </CardTitle>
              <CardDescription>Your earned badges and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {badgesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : badges?.length === 0 ? (
                <div className="text-center py-8" data-testid="no-badges">
                  <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400">Complete learning modules and make purchases to earn badges</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="badges-grid">
                  {badges?.map((userBadge: UserBadge & { badge: BadgeType }) => (
                    <div key={userBadge.id} className="border rounded-lg p-4 text-center" data-testid={`badge-${userBadge.badgeId}`}>
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-medium mb-1">{userBadge.badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{userBadge.badge.description}</p>
                      <Badge variant="outline" className={`
                        ${userBadge.badge.rarity === "legendary" ? "border-purple-500 text-purple-700" : ""}
                        ${userBadge.badge.rarity === "epic" ? "border-orange-500 text-orange-700" : ""}
                        ${userBadge.badge.rarity === "rare" ? "border-blue-500 text-blue-700" : ""}
                        ${userBadge.badge.rarity === "common" ? "border-gray-500 text-gray-700" : ""}
                      `}>
                        {userBadge.badge.rarity}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6" data-testid="journey-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2" />
                Your Botanical Journey
              </CardTitle>
              <CardDescription>Track your progression through the RÜTZ experience</CardDescription>
            </CardHeader>
            <CardContent>
              {journeyLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : journeyProgress ? (
                <div className="space-y-6" data-testid="journey-content">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2" data-testid="current-level">
                      Level {journeyProgress.level}
                    </h3>
                    <p className="text-gray-600 mb-4">Total XP: {journeyProgress.totalXp}</p>
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress to Next Stage</span>
                      <span className="text-sm text-gray-600">{journeyProgress.progressToNext}%</span>
                    </div>
                    <Progress value={journeyProgress.progressToNext} className="h-3" data-testid="journey-progress" />
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Community Impact</h4>
                    <p className="text-sm text-gray-600">
                      Your purchases and engagement have contributed to our community projects, 
                      supporting indigenous communities and environmental conservation efforts.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-journey">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Journey not started</p>
                  <p className="text-sm text-gray-400">Make your first purchase to begin your botanical journey</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}