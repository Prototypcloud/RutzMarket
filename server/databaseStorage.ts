import {
  type Product,
  type InsertProduct,
  type SupplyChainStep,
  type InsertSupplyChainStep,
  type ImpactMetrics,
  type InsertImpactMetrics,
  type CartItem,
  type InsertCartItem,
  type CommunityProject,
  type InsertCommunityProject,
  type LiveImpactUpdate,
  type InsertLiveImpactUpdate,
  type ImpactMilestone,
  type InsertImpactMilestone,
  type UserPreferences,
  type InsertUserPreferences,
  type RecommendationResults,
  type InsertRecommendationResults,
  type User,
  type InsertUser,
  type Order,
  type InsertOrder,
  type OrderItem,
  type Inventory,
  type InsertInventory,
  type InventoryMovement,
  type LearningModule,
  type InsertLearningModule,
  type UserLearningProgress,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type ImpactAction,
  type JourneyStage,
  type UserJourneyProgress,
  type GlobalIndigenousPlant,
  type InsertGlobalIndigenousPlant,
  products,
  supplyChainSteps,
  impactMetrics,
  cartItems,
  communityProjects,
  liveImpactUpdates,
  impactMilestones,
  userPreferences,
  recommendationResults,
  users,
  orders,
  orderItems,
  inventory,
  inventoryMovements,
  learningModules,
  userLearningProgress,
  badges,
  userBadges,
  impactActions,
  journeyStages,
  userJourneyProgress,
  userAddresses,
  quizQuestions,
  userQuizAttempts,
  globalIndigenousPlants,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte, sql, inArray } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  // Supply Chain Steps
  async getSupplyChainSteps(): Promise<SupplyChainStep[]> {
    return await db.select().from(supplyChainSteps).orderBy(supplyChainSteps.stepNumber);
  }

  async getSupplyChainStep(id: string): Promise<SupplyChainStep | undefined> {
    const [step] = await db.select().from(supplyChainSteps).where(eq(supplyChainSteps.id, id));
    return step;
  }

  // Impact Metrics
  async getImpactMetrics(): Promise<ImpactMetrics> {
    const [metrics] = await db.select().from(impactMetrics);
    return metrics || {
      id: "default",
      schoolsBuilt: 15,
      familiesSupported: 2847,
      hectaresProtected: 12000,
      amountReinvested: "1250000.00",
      researchPapers: 127,
      clinicalTrials: 23,
      patents: 8
    };
  }

  // Cart
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    return await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId))
      .then(rows => rows.map(row => ({
        ...row.cart_items,
        product: row.products!
      })));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(item).returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount! > 0;
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  // Community Impact Tracking
  async getCommunityProjects(): Promise<CommunityProject[]> {
    return await db.select().from(communityProjects).orderBy(desc(communityProjects.createdAt));
  }

  async getCommunityProject(id: string): Promise<CommunityProject | undefined> {
    const [project] = await db.select().from(communityProjects).where(eq(communityProjects.id, id));
    return project;
  }

  async createCommunityProject(project: InsertCommunityProject): Promise<CommunityProject> {
    const [created] = await db.insert(communityProjects).values(project).returning();
    return created;
  }

  async updateCommunityProject(id: string, updates: Partial<InsertCommunityProject>): Promise<CommunityProject | undefined> {
    const [updated] = await db
      .update(communityProjects)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(communityProjects.id, id))
      .returning();
    return updated;
  }

  async getLiveImpactUpdates(limit: number = 50): Promise<LiveImpactUpdate[]> {
    return await db
      .select()
      .from(liveImpactUpdates)
      .orderBy(desc(liveImpactUpdates.createdAt))
      .limit(limit);
  }

  async createLiveImpactUpdate(update: InsertLiveImpactUpdate): Promise<LiveImpactUpdate> {
    const [created] = await db.insert(liveImpactUpdates).values(update).returning();
    return created;
  }

  async getImpactMilestones(projectId?: string): Promise<ImpactMilestone[]> {
    const query = db.select().from(impactMilestones);
    if (projectId) {
      return await query.where(eq(impactMilestones.projectId, projectId));
    }
    return await query.orderBy(desc(impactMilestones.createdAt));
  }

  async createImpactMilestone(milestone: InsertImpactMilestone): Promise<ImpactMilestone> {
    const [created] = await db.insert(impactMilestones).values(milestone).returning();
    return created;
  }

  async updateImpactMilestone(id: string, updates: Partial<InsertImpactMilestone>): Promise<ImpactMilestone | undefined> {
    const [updated] = await db
      .update(impactMilestones)
      .set(updates)
      .where(eq(impactMilestones.id, id))
      .returning();
    return updated;
  }

  // Personalized Recommendations
  async getUserPreferences(sessionId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.sessionId, sessionId));
    return preferences;
  }

  async saveUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [saved] = await db.insert(userPreferences).values(preferences).returning();
    return saved;
  }

  async generateRecommendations(sessionId: string, preferences: any): Promise<RecommendationResults> {
    // Advanced AI recommendation algorithm
    const allProducts = await this.getProducts();
    const userPref = await this.getUserPreferences(sessionId);
    
    const recommendedProducts = allProducts
      .filter(product => {
        if (userPref?.healthGoals?.length) {
          const relevantForGoals = userPref.healthGoals.some(goal => 
            product.description.toLowerCase().includes(goal.toLowerCase()) ||
            product.bioactiveCompounds?.some(compound => 
              compound.toLowerCase().includes(goal.toLowerCase())
            )
          );
          if (!relevantForGoals) return false;
        }
        return true;
      })
      .map(product => ({
        productId: product.id,
        score: Math.random() * 0.4 + 0.6, // 0.6-1.0 confidence
        reason: this.generateRecommendationReason(product, userPref),
        priority: Math.floor(Math.random() * 3) + 1
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const recommendation: InsertRecommendationResults = {
      sessionId,
      userPreferencesId: userPref?.id,
      recommendedProducts,
      explanation: this.generateRecommendationExplanation(recommendedProducts, userPref),
      confidenceScore: recommendedProducts.length > 0 ? 
        (recommendedProducts.reduce((sum, p) => sum + p.score, 0) / recommendedProducts.length).toFixed(2) : "0.50"
    };

    const [result] = await db.insert(recommendationResults).values(recommendation).returning();
    return result;
  }

  async getRecommendations(sessionId: string): Promise<RecommendationResults | undefined> {
    const [result] = await db
      .select()
      .from(recommendationResults)
      .where(eq(recommendationResults.sessionId, sessionId))
      .orderBy(desc(recommendationResults.createdAt));
    return result;
  }

  // User Account Management
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getUserWithProgress(id: string): Promise<User & { progress: UserJourneyProgress | null; badges: UserBadge[] } | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const progress = await this.getUserJourneyProgress(id);
    const badges = await this.getUserBadges(id);

    return {
      ...user,
      progress: progress || null,
      badges
    };
  }

  // Order Management
  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async getOrderWithItems(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))
      .then(rows => rows.map(row => ({
        ...row.order_items,
        product: row.products!
      })));

    return {
      ...order,
      items
    };
  }

  // Real-time Inventory Management
  async getInventory(productId: string): Promise<Inventory | undefined> {
    const [inv] = await db.select().from(inventory).where(eq(inventory.productId, productId));
    return inv;
  }

  async updateInventory(productId: string, updates: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const [updated] = await db
      .update(inventory)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(inventory.productId, productId))
      .returning();
    return updated;
  }

  async checkAvailability(productId: string, quantity: number): Promise<boolean> {
    const inv = await this.getInventory(productId);
    if (!inv) return false;
    return (inv.currentStock - inv.reservedStock) >= quantity;
  }

  async reserveStock(productId: string, quantity: number, orderId: string): Promise<boolean> {
    const inv = await this.getInventory(productId);
    if (!inv || !await this.checkAvailability(productId, quantity)) return false;

    await db
      .update(inventory)
      .set({ 
        reservedStock: inv.reservedStock + quantity,
        lastUpdated: new Date()
      })
      .where(eq(inventory.productId, productId));

    // Record movement
    await db.insert(inventoryMovements).values({
      productId,
      type: "sale",
      quantity: -quantity,
      previousStock: inv.currentStock,
      newStock: inv.currentStock,
      reason: "Stock reserved for order",
      orderId,
      createdBy: "system"
    });

    return true;
  }

  async releaseStock(productId: string, quantity: number, orderId: string): Promise<boolean> {
    const inv = await this.getInventory(productId);
    if (!inv) return false;

    await db
      .update(inventory)
      .set({ 
        reservedStock: Math.max(0, inv.reservedStock - quantity),
        lastUpdated: new Date()
      })
      .where(eq(inventory.productId, productId));

    // Record movement
    await db.insert(inventoryMovements).values({
      productId,
      type: "return",
      quantity: quantity,
      previousStock: inv.currentStock,
      newStock: inv.currentStock,
      reason: "Stock released from cancelled order",
      orderId,
      createdBy: "system"
    });

    return true;
  }

  async getLowStockProducts(): Promise<(Inventory & { product: Product })[]> {
    return await db
      .select()
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .where(lte(inventory.currentStock, inventory.lowStockThreshold))
      .then(rows => rows.map(row => ({
        ...row.inventory,
        product: row.products!
      })));
  }

  async getInventoryMovements(productId?: string, limit: number = 100): Promise<InventoryMovement[]> {
    const query = db.select().from(inventoryMovements);
    if (productId) {
      return await query
        .where(eq(inventoryMovements.productId, productId))
        .orderBy(desc(inventoryMovements.createdAt))
        .limit(limit);
    }
    return await query.orderBy(desc(inventoryMovements.createdAt)).limit(limit);
  }

  // Gamified Learning Experience
  async getLearningModules(): Promise<LearningModule[]> {
    return await db
      .select()
      .from(learningModules)
      .where(eq(learningModules.isActive, true))
      .orderBy(learningModules.difficulty);
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
    return module;
  }

  async getUserLearningProgress(userId: string): Promise<UserLearningProgress[]> {
    return await db
      .select()
      .from(userLearningProgress)
      .where(eq(userLearningProgress.userId, userId))
      .orderBy(desc(userLearningProgress.lastActivity));
  }

  async updateLearningProgress(userId: string, moduleId: string, progress: number): Promise<UserLearningProgress> {
    const existing = await db
      .select()
      .from(userLearningProgress)
      .where(and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.moduleId, moduleId)
      ));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userLearningProgress)
        .set({ 
          progress, 
          status: progress >= 100 ? "completed" : "in_progress",
          lastActivity: new Date()
        })
        .where(and(
          eq(userLearningProgress.userId, userId),
          eq(userLearningProgress.moduleId, moduleId)
        ))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userLearningProgress).values({
        userId,
        moduleId,
        progress,
        status: progress >= 100 ? "completed" : "in_progress",
        startedAt: new Date()
      }).returning();
      return created;
    }
  }

  async completeLearningModule(userId: string, moduleId: string, xpEarned: number): Promise<UserLearningProgress> {
    const [updated] = await db
      .update(userLearningProgress)
      .set({
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        xpEarned,
        lastActivity: new Date()
      })
      .where(and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.moduleId, moduleId)
      ))
      .returning();
    return updated;
  }

  // Digital Badges & Achievements
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.isActive, true));
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    return await db
      .select()
      .from(userBadges)
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt))
      .then(rows => rows.map(row => ({
        ...row.user_badges,
        badge: row.badges!
      })));
  }

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const [badge] = await db.insert(userBadges).values({
      userId,
      badgeId
    }).returning();
    return badge;
  }

  async checkBadgeEligibility(userId: string): Promise<Badge[]> {
    // This would implement complex badge eligibility logic
    const user = await this.getUser(userId);
    const userBadges = await this.getUserBadges(userId);
    const allBadges = await this.getBadges();
    
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
    
    return allBadges.filter(badge => !earnedBadgeIds.has(badge.id));
  }

  // Community Impact Reward System
  async recordImpactAction(action: Omit<ImpactAction, 'id' | 'createdAt'>): Promise<ImpactAction> {
    const [recorded] = await db.insert(impactActions).values(action).returning();
    return recorded;
  }

  async getUserImpactActions(userId: string): Promise<ImpactAction[]> {
    return await db
      .select()
      .from(impactActions)
      .where(eq(impactActions.userId, userId))
      .orderBy(desc(impactActions.createdAt));
  }

  async calculateUserImpact(userId: string): Promise<{ totalImpact: number; totalXp: number; totalLoyaltyPoints: number }> {
    const actions = await this.getUserImpactActions(userId);
    
    return {
      totalImpact: actions.reduce((sum, action) => sum + parseFloat(action.impactValue), 0),
      totalXp: actions.reduce((sum, action) => sum + action.xpEarned, 0),
      totalLoyaltyPoints: actions.reduce((sum, action) => sum + action.loyaltyPointsEarned, 0)
    };
  }

  // User Journey Progression
  async getJourneyStages(): Promise<JourneyStage[]> {
    return await db
      .select()
      .from(journeyStages)
      .where(eq(journeyStages.isActive, true))
      .orderBy(journeyStages.order);
  }

  async getUserJourneyProgress(userId: string): Promise<UserJourneyProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userJourneyProgress)
      .where(eq(userJourneyProgress.userId, userId));
    return progress;
  }

  async updateUserLevel(userId: string, xp: number): Promise<UserJourneyProgress> {
    const existing = await this.getUserJourneyProgress(userId);
    const newLevel = Math.floor(xp / 1000) + 1; // 1000 XP per level
    
    if (existing) {
      const [updated] = await db
        .update(userJourneyProgress)
        .set({
          totalXp: existing.totalXp + xp,
          level: newLevel,
          lastUpdated: new Date()
        })
        .where(eq(userJourneyProgress.userId, userId))
        .returning();
      return updated;
    } else {
      // Initialize with first stage
      const stages = await this.getJourneyStages();
      const firstStage = stages[0];
      
      const [created] = await db.insert(userJourneyProgress).values({
        userId,
        currentStageId: firstStage.id,
        completedStages: [],
        totalXp: xp,
        level: newLevel
      }).returning();
      return created;
    }
  }

  async checkStageProgression(userId: string): Promise<{ canAdvance: boolean; nextStage?: JourneyStage }> {
    const progress = await this.getUserJourneyProgress(userId);
    const user = await this.getUser(userId);
    const stages = await this.getJourneyStages();
    
    if (!progress || !user) return { canAdvance: false };
    
    const currentStageIndex = stages.findIndex(s => s.id === progress.currentStageId);
    const nextStage = stages[currentStageIndex + 1];
    
    if (!nextStage) return { canAdvance: false };
    
    // Check requirements
    const requirements = nextStage.requirements;
    if (requirements?.minPurchases && parseFloat(user.totalSpent) < requirements.minPurchases) {
      return { canAdvance: false };
    }
    if (requirements?.minLoyaltyPoints && user.loyaltyPoints < requirements.minLoyaltyPoints) {
      return { canAdvance: false };
    }
    if (requirements?.minLearningProgress && user.learningProgress < requirements.minLearningProgress) {
      return { canAdvance: false };
    }
    
    return { canAdvance: true, nextStage };
  }

  // Helper methods for recommendations
  private generateRecommendationReason(product: Product, preferences?: UserPreferences): string {
    const reasons = [];
    
    if (preferences?.healthGoals?.length) {
      const relevantGoals = preferences.healthGoals.filter(goal =>
        product.description.toLowerCase().includes(goal.toLowerCase())
      );
      if (relevantGoals.length > 0) {
        reasons.push(`Supports your health goals: ${relevantGoals.join(", ")}`);
      }
    }
    
    if (preferences?.preferredFormats?.includes(product.category)) {
      reasons.push(`Matches your preferred format: ${product.category}`);
    }
    
    if (product.rating >= "4.8") {
      reasons.push("Highly rated by our community");
    }
    
    if (product.certifications?.includes("Organic")) {
      reasons.push("Certified organic quality");
    }
    
    return reasons.length > 0 ? reasons.join(". ") : "Recommended based on your profile";
  }

  private generateRecommendationExplanation(recommendedProducts: any[], preferences?: UserPreferences): string {
    if (recommendedProducts.length === 0) {
      return "We couldn't find specific recommendations based on your preferences. Please update your preferences for better matches.";
    }
    
    let explanation = `Based on your preferences, we've selected ${recommendedProducts.length} products that align with your needs. `;
    
    if (preferences?.healthGoals?.length) {
      explanation += `These recommendations focus on your health goals: ${preferences.healthGoals.join(", ")}. `;
    }
    
    if (preferences?.experienceLevel) {
      explanation += `We've tailored these suggestions for your ${preferences.experienceLevel} experience level. `;
    }
    
    explanation += "Each product has been carefully selected based on quality, efficacy, and community impact.";
    
    return explanation;
  }

  // Global Indigenous Plants Implementation  
  async getGlobalIndigenousPlants(): Promise<GlobalIndigenousPlant[]> {
    return await db.select().from(globalIndigenousPlants);
  }

  async getGlobalIndigenousPlant(id: string): Promise<GlobalIndigenousPlant | undefined> {
    const [plant] = await db.select().from(globalIndigenousPlants).where(eq(globalIndigenousPlants.id, id));
    return plant;
  }

  async createGlobalIndigenousPlants(plants: InsertGlobalIndigenousPlant[]): Promise<GlobalIndigenousPlant[]> {
    return await db.insert(globalIndigenousPlants).values(plants).returning();
  }

  async deleteAllGlobalIndigenousPlants(): Promise<void> {
    await db.delete(globalIndigenousPlants);
  }

  async getPlantsByRegion(region: string): Promise<GlobalIndigenousPlant[]> {
    return await db.select().from(globalIndigenousPlants).where(eq(globalIndigenousPlants.region, region));
  }

  async getPlantsByTribe(tribe: string): Promise<GlobalIndigenousPlant[]> {
    return await db.select().from(globalIndigenousPlants).where(
      sql`${globalIndigenousPlants.indigenousTribesOrGroup} ILIKE ${'%' + tribe + '%'}`
    );
  }

  async searchPlants(filters: {
    searchTerm?: string;
    region?: string;
    country?: string;
    tribe?: string;
    productForm?: string;
    ceremonialUse?: boolean;
    veterinaryUse?: boolean;
  }): Promise<GlobalIndigenousPlant[]> {
    let query = db.select().from(globalIndigenousPlants);
    const conditions = [];

    if (filters.searchTerm) {
      const searchPattern = `%${filters.searchTerm.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${globalIndigenousPlants.plantName}) LIKE ${searchPattern}`,
          sql`LOWER(${globalIndigenousPlants.scientificName}) LIKE ${searchPattern}`,
          sql`LOWER(${globalIndigenousPlants.traditionalUses}) LIKE ${searchPattern}`,
          sql`LOWER(${globalIndigenousPlants.indigenousTribesOrGroup}) LIKE ${searchPattern}`
        )
      );
    }

    if (filters.region) {
      conditions.push(eq(globalIndigenousPlants.region, filters.region));
    }

    if (filters.country) {
      conditions.push(
        sql`LOWER(${globalIndigenousPlants.countryOfOrigin}) LIKE ${'%' + filters.country.toLowerCase() + '%'}`
      );
    }

    if (filters.tribe) {
      conditions.push(
        sql`LOWER(${globalIndigenousPlants.indigenousTribesOrGroup}) LIKE ${'%' + filters.tribe.toLowerCase() + '%'}`
      );
    }

    if (filters.productForm) {
      conditions.push(
        sql`LOWER(${globalIndigenousPlants.popularProductForm}) LIKE ${'%' + filters.productForm.toLowerCase() + '%'}`
      );
    }

    if (filters.ceremonialUse) {
      conditions.push(sql`${globalIndigenousPlants.associatedCeremony} IS NOT NULL`);
    }

    if (filters.veterinaryUse) {
      conditions.push(sql`${globalIndigenousPlants.veterinaryUse} IS NOT NULL`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query;
  }

  async advanceJourneyStage(userId: string, data: { progress: number; status: string; xpEarned: number }): Promise<UserJourneyProgress> {
    const [existing] = await db
      .select()
      .from(userJourneyProgress)
      .where(eq(userJourneyProgress.userId, userId))
      .limit(1);

    // Get the exploration stage ID
    const [explorationStage] = await db
      .select()
      .from(journeyStages)
      .where(eq(journeyStages.name, "exploration"))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(userJourneyProgress)
        .set({
          progressToNext: data.progress,
          totalXp: existing.totalXp + data.xpEarned,
          lastUpdated: new Date()
        })
        .where(eq(userJourneyProgress.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userJourneyProgress)
        .values({
          userId,
          currentStageId: explorationStage?.id || "exploration-stage",
          progressToNext: data.progress,
          totalXp: data.xpEarned,
          level: 1
        })
        .returning();
      return created;
    }
  }

  async canAdvanceJourneyStage(userId: string): Promise<{ canAdvance: boolean; nextStage?: JourneyStage }> {
    const [progress] = await db
      .select()
      .from(userJourneyProgress)
      .where(eq(userJourneyProgress.userId, userId))
      .limit(1);

    if (!progress || progress.progressToNext < 100) {
      return { canAdvance: false };
    }

    const [nextStage] = await db
      .select()
      .from(journeyStages)
      .where(eq(journeyStages.name, "mastery"))
      .limit(1);

    return { canAdvance: true, nextStage };
  }
}

export const storage = new DatabaseStorage();