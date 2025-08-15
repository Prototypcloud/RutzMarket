import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, jsonb, boolean } from "drizzle-orm/pg-core";
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

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SupplyChainStep = typeof supplyChainSteps.$inferSelect;
export type InsertSupplyChainStep = z.infer<typeof insertSupplyChainStepSchema>;
export type ImpactMetrics = typeof impactMetrics.$inferSelect;
export type InsertImpactMetrics = z.infer<typeof insertImpactMetricsSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
