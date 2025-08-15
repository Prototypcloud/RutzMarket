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
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type RecommendationResults = typeof recommendationResults.$inferSelect;
export type InsertRecommendationResults = z.infer<typeof insertRecommendationResultsSchema>;
