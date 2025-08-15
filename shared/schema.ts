import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  origin: text("origin").notNull(),
  category: text("category").notNull(),
  sector: text("sector").notNull(), // Nutraceuticals/Supplements, Functional Foods & Beverages, etc.
  plantMaterial: text("plant_material").notNull(), // Chaga, Turmeric, Ashwagandha, etc.
  productType: text("product_type").notNull(), // Extract powder, capsules, RTD tea, etc.
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  imageUrl: text("image_url").notNull(),
  qrCode: text("qr_code").notNull(),
  scientificName: text("scientific_name"),
  extractionMethod: text("extraction_method"),
  bioactiveCompounds: jsonb("bioactive_compounds").$type<string[]>(),
  certifications: jsonb("certifications").$type<string[]>(),
  sustainabilityStory: text("sustainability_story"),
  communityImpact: text("community_impact"),
  researchPapers: jsonb("research_papers").$type<{ title: string; url: string; year: number }[]>(),
  inStock: boolean("in_stock").notNull().default(true),
});

export const supplyChainSteps = pgTable("supply_chain_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  details: text("details").notNull(),
  location: text("location"),
  certifications: jsonb("certifications").$type<string[]>(),
});

export const impactMetrics = pgTable("impact_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolsBuilt: integer("schools_built").notNull(),
  familiesSupported: integer("families_supported").notNull(),
  hectaresProtected: integer("hectares_protected").notNull(),
  amountReinvested: decimal("amount_reinvested", { precision: 12, scale: 2 }).notNull(),
  researchPapers: integer("research_papers").notNull(),
  clinicalTrials: integer("clinical_trials").notNull(),
  patents: integer("patents").notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  sessionId: text("session_id").notNull(),
});

// Community Impact Tracking Tables
export const communityProjects = pgTable("community_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  community: text("community").notNull(),
  category: text("category").notNull(), // education, infrastructure, healthcare, environment
  status: text("status").notNull().default("active"), // planning, active, completed
  progress: integer("progress").notNull().default(0), // 0-100 percentage
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }).notNull(),
  currentFunding: decimal("current_funding", { precision: 10, scale: 2 }).notNull().default("0.00"),
  startDate: timestamp("start_date").notNull(),
  targetCompletionDate: timestamp("target_completion_date"),
  completionDate: timestamp("completion_date"),
  beneficiaries: integer("beneficiaries").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const liveImpactUpdates = pgTable("live_impact_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => communityProjects.id),
  updateType: text("update_type").notNull(), // progress, funding, milestone, completion
  title: text("title").notNull(),
  description: text("description").notNull(),
  previousValue: decimal("previous_value", { precision: 10, scale: 2 }),
  newValue: decimal("new_value", { precision: 10, scale: 2 }),
  impactMetric: text("impact_metric"), // schools_built, families_supported, trees_planted, etc.
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const impactMilestones = pgTable("impact_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => communityProjects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetDate: timestamp("target_date").notNull(),
  achievedDate: timestamp("achieved_date"),
  isAchieved: boolean("is_achieved").notNull().default(false),
  celebrationMessage: text("celebration_message"),
  impactValue: integer("impact_value").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertSupplyChainStepSchema = createInsertSchema(supplyChainSteps).omit({
  id: true,
});

export const insertImpactMetricsSchema = createInsertSchema(impactMetrics).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertCommunityProjectSchema = createInsertSchema(communityProjects).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertLiveImpactUpdateSchema = createInsertSchema(liveImpactUpdates).omit({
  id: true,
  createdAt: true,
});

export const insertImpactMilestoneSchema = createInsertSchema(impactMilestones).omit({
  id: true,
  createdAt: true,
});

// Personalized Recommendation Engine Tables
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  healthGoals: jsonb("health_goals").$type<string[]>(),
  lifestyle: text("lifestyle"), // active, moderate, sedentary
  dietaryRestrictions: jsonb("dietary_restrictions").$type<string[]>(),
  preferredFormats: jsonb("preferred_formats").$type<string[]>(), // tea, capsules, powder, etc.
  budgetRange: text("budget_range"), // low, medium, high
  experienceLevel: text("experience_level"), // beginner, intermediate, advanced
  specificConcerns: jsonb("specific_concerns").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recommendationResults = pgTable("recommendation_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  userPreferencesId: varchar("user_preferences_id").references(() => userPreferences.id),
  recommendedProducts: jsonb("recommended_products").$type<{
    productId: string;
    score: number;
    reason: string;
    priority: number;
  }[]>(),
  explanation: text("explanation").notNull(),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecommendationResultsSchema = createInsertSchema(recommendationResults).omit({
  id: true,
  createdAt: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SupplyChainStep = typeof supplyChainSteps.$inferSelect;
export type InsertSupplyChainStep = z.infer<typeof insertSupplyChainStepSchema>;
export type ImpactMetrics = typeof impactMetrics.$inferSelect;
export type InsertImpactMetrics = z.infer<typeof insertImpactMetricsSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CommunityProject = typeof communityProjects.$inferSelect;
export type InsertCommunityProject = z.infer<typeof insertCommunityProjectSchema>;
export type LiveImpactUpdate = typeof liveImpactUpdates.$inferSelect;
export type InsertLiveImpactUpdate = z.infer<typeof insertLiveImpactUpdateSchema>;
export type ImpactMilestone = typeof impactMilestones.$inferSelect;
export type InsertImpactMilestone = z.infer<typeof insertImpactMilestoneSchema>;
// User Account Management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).notNull().default("0.00"),
  learningProgress: integer("learning_progress").notNull().default(0), // 0-100%
});

export const userAddresses = pgTable("user_addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // shipping, billing
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Order Management
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull().default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shippingAddressId: varchar("shipping_address_id").references(() => userAddresses.id),
  billingAddressId: varchar("billing_address_id").references(() => userAddresses.id),
  trackingNumber: text("tracking_number"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Real-time Inventory Management
export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  currentStock: integer("current_stock").notNull().default(0),
  reservedStock: integer("reserved_stock").notNull().default(0), // for pending orders
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
  reorderPoint: integer("reorder_point").notNull().default(20),
  maxStock: integer("max_stock").notNull().default(1000),
  lastRestocked: timestamp("last_restocked"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  type: text("type").notNull(), // restock, sale, adjustment, return
  quantity: integer("quantity").notNull(), // positive for increases, negative for decreases
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: text("reason"),
  orderId: varchar("order_id").references(() => orders.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: varchar("created_by"), // system or user id
});

// Gamified Learning Experience
export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  plantMaterial: text("plant_material").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedTime: integer("estimated_time").notNull(), // minutes
  xpReward: integer("xp_reward").notNull().default(100),
  content: jsonb("content").$type<{
    sections: {
      title: string;
      type: "text" | "video" | "quiz" | "interactive";
      content: any;
    }[];
  }>(),
  prerequisites: jsonb("prerequisites").$type<string[]>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userLearningProgress = pgTable("user_learning_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  progress: integer("progress").notNull().default(0), // 0-100%
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").notNull().default(0), // minutes
  xpEarned: integer("xp_earned").notNull().default(0),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id),
  question: text("question").notNull(),
  type: text("type").notNull(), // multiple_choice, true_false, fill_blank
  options: jsonb("options").$type<string[]>(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull().default(1), // 1-5
  points: integer("points").notNull().default(10),
});

export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  questionId: varchar("question_id").notNull().references(() => quizQuestions.id),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// Digital Badges & Achievements
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
  category: text("category").notNull(), // learning, purchase, community, streak
  requirement: jsonb("requirement").$type<{
    type: string;
    value: number;
    criteria: any;
  }>(),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  xpReward: integer("xp_reward").notNull().default(50),
  loyaltyPointsReward: integer("loyalty_points_reward").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  isDisplayed: boolean("is_displayed").notNull().default(true),
});

// Community Impact Reward System
export const impactActions = pgTable("impact_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // purchase, learning, sharing, review
  productId: varchar("product_id").references(() => products.id),
  orderId: varchar("order_id").references(() => orders.id),
  impactValue: decimal("impact_value", { precision: 10, scale: 2 }).notNull(), // monetary value of impact
  description: text("description").notNull(),
  loyaltyPointsEarned: integer("loyalty_points_earned").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User Journey Progression
export const journeyStages = pgTable("journey_stages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  requirements: jsonb("requirements").$type<{
    minPurchases?: number;
    minLearningProgress?: number;
    minLoyaltyPoints?: number;
    requiredBadges?: string[];
  }>(),
  rewards: jsonb("rewards").$type<{
    xp?: number;
    loyaltyPoints?: number;
    discount?: number;
    badgeId?: string;
  }>(),
  iconUrl: text("icon_url").notNull(),
  colorScheme: text("color_scheme").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentStageId: varchar("current_stage_id").notNull().references(() => journeyStages.id),
  completedStages: jsonb("completed_stages").$type<string[]>(),
  progressToNext: integer("progress_to_next").notNull().default(0), // 0-100%
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Insert schemas and types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
  createdAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type UserLearningProgress = typeof userLearningProgress.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type ImpactAction = typeof impactActions.$inferSelect;
export type JourneyStage = typeof journeyStages.$inferSelect;
export type UserJourneyProgress = typeof userJourneyProgress.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type RecommendationResults = typeof recommendationResults.$inferSelect;
export type InsertRecommendationResults = z.infer<typeof insertRecommendationResultsSchema>;
