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
  globalIndigenousPlants,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte, sql, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Supply Chain Steps
  getSupplyChainSteps(): Promise<SupplyChainStep[]>;
  getSupplyChainStep(id: string): Promise<SupplyChainStep | undefined>;
  
  // Impact Metrics
  getImpactMetrics(): Promise<ImpactMetrics>;
  
  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Community Impact Tracking
  getCommunityProjects(): Promise<CommunityProject[]>;
  getCommunityProject(id: string): Promise<CommunityProject | undefined>;
  createCommunityProject(project: InsertCommunityProject): Promise<CommunityProject>;
  updateCommunityProject(id: string, updates: Partial<InsertCommunityProject>): Promise<CommunityProject | undefined>;
  
  getLiveImpactUpdates(limit?: number): Promise<LiveImpactUpdate[]>;
  createLiveImpactUpdate(update: InsertLiveImpactUpdate): Promise<LiveImpactUpdate>;
  
  getImpactMilestones(projectId?: string): Promise<ImpactMilestone[]>;
  createImpactMilestone(milestone: InsertImpactMilestone): Promise<ImpactMilestone>;
  updateImpactMilestone(id: string, updates: Partial<InsertImpactMilestone>): Promise<ImpactMilestone | undefined>;

  // Personalized Recommendations
  getUserPreferences(sessionId: string): Promise<UserPreferences | undefined>;
  saveUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  generateRecommendations(sessionId: string, preferences: any): Promise<RecommendationResults>;
  getRecommendations(sessionId: string): Promise<RecommendationResults | undefined>;

  // User Account Management
  createUser(user: InsertUser): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUserWithProgress(id: string): Promise<User & { progress: UserJourneyProgress | null; badges: UserBadge[] } | undefined>;

  // Order Management
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getOrderWithItems(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;

  // Real-time Inventory Management
  getInventory(productId: string): Promise<Inventory | undefined>;
  updateInventory(productId: string, updates: Partial<InsertInventory>): Promise<Inventory | undefined>;
  checkAvailability(productId: string, quantity: number): Promise<boolean>;
  reserveStock(productId: string, quantity: number, orderId: string): Promise<boolean>;
  releaseStock(productId: string, quantity: number, orderId: string): Promise<boolean>;
  getLowStockProducts(): Promise<(Inventory & { product: Product })[]>;
  getInventoryMovements(productId?: string, limit?: number): Promise<InventoryMovement[]>;

  // Gamified Learning Experience
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  getUserLearningProgress(userId: string): Promise<UserLearningProgress[]>;
  updateLearningProgress(userId: string, moduleId: string, progress: number): Promise<UserLearningProgress>;
  completeLearningModule(userId: string, moduleId: string, xpEarned: number): Promise<UserLearningProgress>;

  // Digital Badges & Achievements
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: string, badgeId: string): Promise<UserBadge>;
  checkBadgeEligibility(userId: string): Promise<Badge[]>;

  // Community Impact Reward System
  recordImpactAction(action: Omit<ImpactAction, 'id' | 'createdAt'>): Promise<ImpactAction>;
  getUserImpactActions(userId: string): Promise<ImpactAction[]>;
  calculateUserImpact(userId: string): Promise<{ totalImpact: number; totalXp: number; totalLoyaltyPoints: number }>;

  // User Journey Progression
  getJourneyStages(): Promise<JourneyStage[]>;
  getUserJourneyProgress(userId: string): Promise<UserJourneyProgress | undefined>;
  updateUserLevel(userId: string, xp: number): Promise<UserJourneyProgress>;
  checkStageProgression(userId: string): Promise<{ canAdvance: boolean; nextStage?: JourneyStage }>;

  // Global Indigenous Plants
  getGlobalIndigenousPlants(): Promise<GlobalIndigenousPlant[]>;
  getGlobalIndigenousPlant(id: string): Promise<GlobalIndigenousPlant | undefined>;
  createGlobalIndigenousPlants(plants: InsertGlobalIndigenousPlant[]): Promise<GlobalIndigenousPlant[]>;
  deleteAllGlobalIndigenousPlants(): Promise<void>;
  getPlantsByRegion(region: string): Promise<GlobalIndigenousPlant[]>;
  getPlantsByTribe(tribe: string): Promise<GlobalIndigenousPlant[]>;
  searchPlants(filters: {
    searchTerm?: string;
    region?: string;
    country?: string;
    tribe?: string;
    productForm?: string;
    ceremonialUse?: boolean;
    veterinaryUse?: boolean;
  }): Promise<GlobalIndigenousPlant[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private supplyChainSteps: Map<string, SupplyChainStep>;
  private impactMetrics!: ImpactMetrics;
  private cartItems: Map<string, CartItem>;
  private communityProjects: Map<string, CommunityProject>;
  private liveImpactUpdates: LiveImpactUpdate[];
  private impactMilestones: Map<string, ImpactMilestone>;
  private userPreferences: Map<string, UserPreferences>;
  private recommendationResults: Map<string, RecommendationResults>;
  private globalIndigenousPlants: Map<string, GlobalIndigenousPlant>;

  constructor() {
    this.products = new Map();
    this.supplyChainSteps = new Map();
    this.cartItems = new Map();
    this.communityProjects = new Map();
    this.liveImpactUpdates = [];
    this.impactMilestones = new Map();
    this.userPreferences = new Map();
    this.recommendationResults = new Map();
    this.globalIndigenousPlants = new Map();
    this.initializeData();
    this.initializeGlobalIndigenousPlants();
  }

  private initializeData() {
    // Initialize products with comprehensive plant-based classification
    const productData: Product[] = [
      // CHAGA MUSHROOM PRODUCTS - Full product line from raw material
      {
        id: "chaga-extract-powder",
        name: "Chaga Extract Powder - β-glucans + Triterpenes",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Standardized dry extract powder concentrated with bioactive β-glucans and triterpenes from wild-harvested Chaga mushrooms. Premium quality for immune system support and antioxidant protection.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Standardized β-glucans and triterpenes extract powder",
        price: "89.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Chaga Mushroom",
        productType: "Standardized dry extract powder (β-glucans + triterpenes)",
        rating: "4.9",
        reviewCount: 89,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-CHA-001",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Water-ethanol dual extraction + standardization",
        bioactiveCompounds: ["β-glucans", "Betulinic acid", "Inotodiol", "Melanin complexes"],
        certifications: ["Wild-harvested", "Organic", "GMP Certified"],
        sustainabilityStory: "Sustainably wild-harvested from the Cheslatta Carrier Nation's traditional territory using ancestral methods that ensure tree survival and ecosystem preservation.",
        communityImpact: "Supporting the Cheslatta Carrier Nation with ethical partnership agreements, fair trade practices, and traditional knowledge preservation programs.",
        researchPapers: [
          { title: "Immunomodulatory Effects of Chaga β-glucans", url: "#", year: 2023 },
          { title: "Antioxidant Properties of Inonotus obliquus Extracts", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "chaga-capsules",
        name: "Chaga Extract Capsules",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Convenient encapsulated chaga extract in vegetarian capsules. Each capsule contains 500mg of standardized chaga extract for daily immune support.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. 500mg chaga extract in vegetarian capsules",
        price: "59.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Capsules",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Chaga Mushroom",
        productType: "Encapsulated extract (capsules / tablets / softgels)",
        rating: "4.7",
        reviewCount: 156,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-CHA-002",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Dual extraction (water + ethanol)",
        bioactiveCompounds: ["β-glucans", "Triterpenes", "Polyphenols"],
        certifications: ["Vegan", "Non-GMO", "Third-party tested"],
        sustainabilityStory: "Each purchase supports reforestation efforts in harvested areas, maintaining ecological balance.",
        communityImpact: "Provides sustainable income to local foragers and their families while preserving traditional harvesting knowledge.",
        researchPapers: [
          { title: "Bioavailability of Encapsulated Mushroom Extracts", url: "#", year: 2023 }
        ],
        inStock: true
      },
      {
        id: "labrador-tea-premium-blend",
        name: "Labrador Tea Premium Blend",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium artisanal blend of wild Labrador tea leaves, hand-harvested and traditionally prepared. Rich in antioxidants with a distinctive piney-citrus flavor profile that has been treasured by Indigenous communities for generations.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium wild Labrador tea blend in elegant tin",
        price: "34.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Premium Teas",
        sector: "Traditional Medicine & Wellness Teas",
        plantMaterial: "Labrador Tea (Rhododendron groenlandicum)",
        productType: "Premium loose-leaf herbal tea blend",
        rating: "4.9",
        reviewCount: 127,
        imageUrl: "/assets/labrador-tea-premium-blend-new.png",
        qrCode: "RUTZ-LAB-001",
        scientificName: "Rhododendron groenlandicum",
        extractionMethod: "Traditional air-drying and careful leaf preparation",
        bioactiveCompounds: ["Quercetin", "Arbutin", "Tannins", "Essential oils"],
        certifications: ["Wild-harvested", "Traditional preparation", "Sustainably sourced"],
        sustainabilityStory: "Harvested using traditional Indigenous methods that ensure plant regeneration and ecosystem preservation. Packaged in reusable premium tin containers.",
        communityImpact: "Direct partnership with Cheslatta Carrier Nation harvesters, preserving traditional knowledge and providing sustainable income to Indigenous families.",
        researchPapers: [
          { title: "Bioactive Compounds in Labrador Tea: Traditional Use and Modern Research", url: "#", year: 2023 },
          { title: "Antioxidant Properties of Northern Bog Plants", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "chaga-functional-latte",
        name: "Plant-Based Chaga Functional Latte",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Creamy plant-based latte blend with chaga extract, adaptogens, and natural flavors. Perfect morning ritual for immune support and mental clarity.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Plant-based functional latte with chaga and adaptogens",
        price: "24.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Latte Mixes",
        sector: "Functional Foods & Beverages",
        plantMaterial: "Chaga Mushroom",
        productType: "Plant-based functional latte (with extract)",
        rating: "4.6",
        reviewCount: 134,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-CHA-004",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Spray-dried extract integration",
        bioactiveCompounds: ["β-glucans", "Melanin", "Adaptogenic compounds"],
        certifications: ["Vegan", "Gluten-free", "No artificial flavors"],
        sustainabilityStory: "Plant-based ingredients sourced from regenerative agriculture practices.",
        communityImpact: "Supports organic farming cooperatives and sustainable packaging initiatives.",
        researchPapers: [
          { title: "Functional Beverage Applications of Mushroom Extracts", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "chaga-face-serum",
        name: "Chaga Antioxidant Face Serum",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Luxurious anti-aging face serum enriched with chaga extract and melanin complexes. Provides powerful antioxidant protection and skin rejuvenation.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Anti-aging serum with chaga melanin complexes",
        price: "79.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Skincare",
        sector: "Cosmetics & Personal Care",
        plantMaterial: "Chaga Mushroom",
        productType: "Antioxidant face serum / cream",
        rating: "4.8",
        reviewCount: 92,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-CHA-005",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Specialized cosmetic-grade extraction",
        bioactiveCompounds: ["Melanin", "Antioxidant polyphenols", "β-glucans"],
        certifications: ["Cruelty-free", "Paraben-free", "Dermatologically tested"],
        sustainabilityStory: "Sustainable packaging with refillable glass bottles and biodegradable components.",
        communityImpact: "Supports women's cooperatives in harvesting communities through fair trade partnerships.",
        researchPapers: [
          { title: "Cosmetic Applications of Chaga Melanin", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "chaga-wound-care-gel",
        name: "Chaga Wound-Care Hydrogel",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Advanced biomedical hydrogel with purified chaga actives for wound healing and skin regeneration. Clinical-grade formula for healthcare applications.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Clinical-grade wound-care hydrogel with chaga actives",
        price: "149.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Medical Devices",
        sector: "Biomedical / Pharma Leads",
        plantMaterial: "Chaga Mushroom",
        productType: "Wound-care hydrogel with chaga actives",
        rating: "4.9",
        reviewCount: 34,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-CHA-006",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Pharmaceutical-grade purification",
        bioactiveCompounds: ["Purified β-glucans", "Triterpenes", "Bioactive polysaccharides"],
        certifications: ["FDA Registered", "GMP Certified", "Clinical Grade"],
        sustainabilityStory: "Produced in certified clean rooms with zero-waste manufacturing processes.",
        communityImpact: "Portion of proceeds funds medical research and healthcare access in rural communities.",
        researchPapers: [
          { title: "Chaga Polysaccharides in Wound Healing Applications", url: "#", year: 2024 },
          { title: "Clinical Efficacy of Mushroom-Based Hydrogels", url: "#", year: 2023 }
        ],
        inStock: true
      },
      // TURMERIC PRODUCTS - Existing with new schema fields
      {
        id: "turmeric-extract",
        name: "Turmeric Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium curcumin with 95% bioavailability. Anti-inflammatory powerhouse backed by heritage craftsmanship.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium curcumin with 95% bioavailability and anti-inflammatory properties",
        price: "49.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Turmeric",
        productType: "Standardized extract powder",
        rating: "4.9",
        reviewCount: 127,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-TUR-001",
        scientificName: "Curcuma longa",
        extractionMethod: "CO2 Supercritical Extraction",
        bioactiveCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin"],
        certifications: ["Organic", "Fair Trade", "Heritage Validated"],
        sustainabilityStory: "Harvested by traditional farming cooperatives in Kerala using ancient cultivation methods passed down through generations.",
        communityImpact: "Every purchase supports 50 farming families and funds clean water projects in rural Kerala.",
        researchPapers: [
          { title: "Bioavailability Enhancement of Curcumin via CO2 Extraction", url: "#", year: 2023 },
          { title: "Anti-inflammatory Properties of Indigenous Turmeric Varieties", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "devils-club-root-extract",
        name: "Devil's Club Root Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Powerful liquid extract of Devil's Club root, traditionally used by Pacific Northwest Indigenous communities for immune support and joint wellness. Hand-harvested roots are carefully processed using traditional methods combined with modern extraction techniques.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Traditional Pacific Northwest root extract for immune and joint support",
        price: "68.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Liquid Extracts",
        sector: "Traditional Medicine & Wellness",
        plantMaterial: "Devil's Club Root",
        productType: "Concentrated liquid herbal extract",
        rating: "4.8",
        reviewCount: 84,
        imageUrl: "/assets/devils-club-root-extract.png",
        qrCode: "RUTZ-DCL-001",
        scientificName: "Oplopanax horridus",
        extractionMethod: "Traditional alcohol-water extraction",
        bioactiveCompounds: ["Saponins", "Polysaccharides", "Phenolic compounds", "Triterpenes"],
        certifications: ["Wild-harvested", "Traditional preparation", "Third-party tested"],
        sustainabilityStory: "Sustainably wild-harvested using traditional Indigenous methods that respect the plant's sacred nature and ensure regeneration. Devil's Club is considered a powerful medicine plant by Pacific Northwest tribes.",
        communityImpact: "Direct partnership with traditional harvesters preserves ancestral knowledge while providing sustainable income. Portion of proceeds supports Indigenous youth education programs.",
        researchPapers: [
          { title: "Ethnobotanical Study of Oplopanax horridus in Pacific Northwest", url: "#", year: 2023 },
          { title: "Bioactive Compounds in Devil's Club Root Extracts", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "bearberry-leaf-capsules",
        name: "Bearberry Leaf Capsules",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium bearberry leaf extract in vegetarian capsules, traditionally used by Indigenous communities for urinary tract and kidney health. Rich in arbutin and natural antimicrobial compounds.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Traditional urinary tract support in vegetarian capsules",
        price: "42.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Capsules",
        sector: "Traditional Medicine & Wellness",
        plantMaterial: "Bearberry Leaves",
        productType: "Encapsulated herbal extract",
        rating: "4.7",
        reviewCount: 96,
        imageUrl: "/assets/bearberry-leaf-capsules.png",
        qrCode: "RUTZ-BEA-001",
        scientificName: "Arctostaphylos uva-ursi",
        extractionMethod: "Standardized leaf extraction",
        bioactiveCompounds: ["Arbutin", "Hydroquinone", "Tannins", "Quercetin"],
        certifications: ["Wild-harvested", "Vegetarian capsules", "Third-party tested"],
        sustainabilityStory: "Sustainably wild-harvested using traditional Indigenous methods that ensure plant regeneration. Bearberry has been used by Arctic and subarctic Indigenous peoples for generations.",
        communityImpact: "Direct partnership with Indigenous harvesters preserves traditional knowledge while providing sustainable income. Supports community health programs in northern territories.",
        researchPapers: [
          { title: "Antimicrobial Properties of Arctostaphylos uva-ursi", url: "#", year: 2023 },
          { title: "Traditional Uses and Modern Applications of Bearberry", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "sweetgrass-aromatherapy-oil",
        name: "Sweetgrass Aromatherapy Oil",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Sacred sweetgrass essential oil for ceremonial use and aromatherapy. This holy plant, known as 'the hair of Mother Earth,' has been used by Indigenous peoples for purification, prayer, and spiritual healing for thousands of years.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Sacred ceremonial aromatherapy oil, 30ml bottle",
        price: "58.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Essential Oils",
        sector: "Ceremonial & Aromatherapy",
        plantMaterial: "Sweetgrass (Hierochloe odorata)",
        productType: "Pure essential oil for aromatherapy",
        rating: "4.9",
        reviewCount: 143,
        imageUrl: "/assets/sweetgrass-aromatherapy-oil.png",
        qrCode: "RUTZ-SWG-001",
        scientificName: "Hierochloe odorata",
        extractionMethod: "Steam distillation of braided grass",
        bioactiveCompounds: ["Coumarin", "Vanillin", "Benzoic acid", "Phytol"],
        certifications: ["Ceremonial grade", "Wild-harvested", "Traditional preparation"],
        sustainabilityStory: "Sustainably wild-harvested using traditional Indigenous methods with deep respect for this sacred plant. Each harvest includes prayers and ceremonies to honor the plant spirits.",
        communityImpact: "Direct partnership with traditional knowledge keepers and ceremonial leaders. Portion of proceeds supports Indigenous cultural preservation programs and youth education about traditional plant medicines.",
        researchPapers: [
          { title: "Sacred Plants in Indigenous Ceremony: Ethnobotanical Study", url: "#", year: 2023 },
          { title: "Aromatic Compounds in Traditional Ceremonial Plants", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "eastern-white-cedar-tea",
        name: "Eastern White Cedar Tea",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Traditional Indigenous needle tea made from Eastern White Cedar, historically used by First Nations peoples for vitamin C and immune support. Known as the 'Tree of Life,' this sacred tea helped sustain Indigenous communities through harsh winters.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Traditional vitamin C-rich needle tea for immune support, 19g pouch",
        price: "24.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Herbal Teas",
        sector: "Traditional Medicine & Wellness",
        plantMaterial: "Eastern White Cedar Needles",
        productType: "Loose leaf herbal tea",
        rating: "4.8",
        reviewCount: 127,
        imageUrl: "/assets/eastern-white-cedar-tea.png",
        qrCode: "RUTZ-EWC-001",
        scientificName: "Thuja occidentalis",
        extractionMethod: "Traditional needle preparation",
        bioactiveCompounds: ["Vitamin C", "Thujone", "Essential oils", "Tannins"],
        certifications: ["Wild-harvested", "Traditional preparation", "Organic"],
        sustainabilityStory: "Sustainably harvested using traditional Indigenous methods that only take what is needed and ensure tree health. Cedar is considered sacred and harvesting includes prayers of gratitude.",
        communityImpact: "Direct partnership with traditional knowledge keepers who have maintained this practice for generations. Supports Indigenous youth programs teaching traditional plant knowledge and sustainable harvesting.",
        researchPapers: [
          { title: "Nutritional Analysis of Traditional Indigenous Teas", url: "#", year: 2023 },
          { title: "Vitamin C Content in Eastern White Cedar Preparations", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "wild-rose-hip-powder",
        name: "Wild Rose Hip Powder",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Premium vitamin C-rich superfood powder from wild Canadian rose hips, traditionally gathered by Indigenous communities for immune support and winter nutrition. One of nature's most potent sources of natural vitamin C.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Vitamin C-rich superfood powder from Canadian wilderness, 150g pouch",
        price: "32.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Superfood Powders",
        sector: "Traditional Medicine & Wellness",
        plantMaterial: "Wild Rose Hips",
        productType: "Fine ground superfood powder",
        rating: "4.9",
        reviewCount: 156,
        imageUrl: "/assets/wild-rose-hip-powder.png",
        qrCode: "RUTZ-WRH-001",
        scientificName: "Rosa acicularis",
        extractionMethod: "Traditional drying and fine grinding",
        bioactiveCompounds: ["Vitamin C", "Lycopene", "Beta-carotene", "Bioflavonoids"],
        certifications: ["Wild-harvested", "Raw powder", "Organic certified"],
        sustainabilityStory: "Sustainably wild-harvested from pristine Canadian wilderness using traditional Indigenous methods that ensure plant regeneration. Rose hips are gathered at peak ripeness when vitamin C content is highest.",
        communityImpact: "Direct partnership with Indigenous harvesters who have maintained traditional gathering practices for generations. Supports community health initiatives and traditional food sovereignty programs.",
        researchPapers: [
          { title: "Vitamin C Content Analysis of Wild Canadian Rose Hips", url: "#", year: 2023 },
          { title: "Traditional Indigenous Superfood Preparations and Nutrition", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "cloudberry-antioxidant-powder",
        name: "Cloudberry Antioxidant Powder",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Rare Arctic superfruit powder from wild cloudberries, traditionally gathered by Indigenous communities in northern territories. This golden berry contains exceptional levels of antioxidants, vitamin C, and unique Arctic compounds.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Rare Arctic superfruit with concentrated antioxidants, 100g pouch",
        price: "48.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Superfood Powders",
        sector: "Traditional Medicine & Wellness",
        plantMaterial: "Wild Cloudberries",
        productType: "Freeze-dried superfruit powder",
        rating: "4.9",
        reviewCount: 89,
        imageUrl: "/assets/cloudberry-antioxidant-powder.png",
        qrCode: "RUTZ-CLD-001",
        scientificName: "Rubus chamaemorus",
        extractionMethod: "Freeze-drying to preserve delicate compounds",
        bioactiveCompounds: ["Anthocyanins", "Ellagic acid", "Vitamin C", "Omega-3 fatty acids"],
        certifications: ["Wild-harvested", "Raw superfruit", "Arctic certified"],
        sustainabilityStory: "Sustainably wild-harvested from pristine Arctic wilderness using traditional Indigenous methods. Cloudberries grow slowly in harsh northern conditions, making them a precious and rare superfruit that requires careful stewardship.",
        communityImpact: "Direct partnership with Indigenous communities in Arctic regions who have traditional rights and knowledge of cloudberry gathering. Supports northern community economic development and traditional food systems.",
        researchPapers: [
          { title: "Antioxidant Properties of Arctic Berries: Cloudberry Analysis", url: "#", year: 2023 },
          { title: "Traditional Uses and Nutritional Value of Rubus chamaemorus", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "ashwagandha-root",
        name: "Ashwagandha Root Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Adaptogenic herb for stress relief and vitality. Traditional wisdom meets modern extraction techniques for optimal bioactivity.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Adaptogenic herb for stress relief and vitality",
        price: "39.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Ashwagandha",
        productType: "Standardized extract powder",
        rating: "4.8",
        reviewCount: 93,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-ASH-002",
        scientificName: "Withania somnifera",
        extractionMethod: "Hydroalcoholic Extraction",
        bioactiveCompounds: ["Withanolides", "Alkaloids", "Saponins"],
        certifications: ["Organic", "Fair Trade", "Ayurvedic Validated"],
        sustainabilityStory: "Wild-harvested by indigenous communities using sustainable practices that preserve root systems.",
        communityImpact: "Supports traditional knowledge keepers and funds educational programs in rural Rajasthan.",
        researchPapers: [
          { title: "Adaptogenic Properties of Standardized Ashwagandha Extract", url: "#", year: 2023 }
        ],
        inStock: true
      },
      {
        id: "moringa-extract",
        name: "Moringa Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Nutrient-dense superfood with 90+ vitamins and minerals. Sustainable community farming program.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Nutrient-dense superfood with 90+ vitamins and minerals",
        price: "29.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Moringa",
        productType: "Standardized extract powder",
        rating: "4.7",
        reviewCount: 156,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-MOR-003",
        scientificName: "Moringa oleifera",
        extractionMethod: "Low-Temperature Dehydration",
        bioactiveCompounds: ["Quercetin", "Kaempferol", "Chlorogenic Acid"],
        certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
        sustainabilityStory: "Grown in agroforestry systems that restore degraded land and improve soil health.",
        communityImpact: "Provides income to 200+ farmers and funds school feeding programs in rural Ghana.",
        researchPapers: [
          { title: "Nutritional Profile of Moringa oleifera Leaves", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "ginkgo-biloba",
        name: "Ginkgo Biloba",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Cognitive enhancement extract with standardized flavonoids. Ancient wisdom, modern purity through advanced extraction methods.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Cognitive enhancement extract with standardized flavonoids",
        price: "44.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Ginkgo Biloba",
        productType: "Standardized extract powder",
        rating: "4.6",
        reviewCount: 89,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-GIN-004",
        scientificName: "Ginkgo biloba",
        extractionMethod: "Standardized Solvent Extraction",
        bioactiveCompounds: ["Flavonoids", "Terpenoids", "Ginkgolides"],
        certifications: ["GMP Certified", "Traditional Medicine Validated"],
        sustainabilityStory: "Harvested from ancient temple groves in partnership with Buddhist monasteries.",
        communityImpact: "Supports monastery communities and traditional medicine preservation programs.",
        researchPapers: [
          { title: "Cognitive Benefits of Standardized Ginkgo Extract", url: "#", year: 2023 }
        ],
        inStock: true
      },
      {
        id: "rhodiola-rosea",
        name: "Rhodiola Rosea",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Arctic adaptogen for mental performance. Sustainably wild-harvested by indigenous communities.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Arctic adaptogen for mental performance",
        price: "54.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders", 
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Rhodiola Rosea",
        productType: "Standardized extract powder",
        rating: "4.9",
        reviewCount: 67,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-RHO-005",
        scientificName: "Rhodiola rosea",
        extractionMethod: "Cryogenic Extraction",
        bioactiveCompounds: ["Salidroside", "Rosavin", "Tyrosol"],
        certifications: ["Wild-Harvested", "Indigenous Partnership", "Arctic Council Approved"],
        sustainabilityStory: "Collected using traditional methods by Siberian indigenous peoples during optimal harvest seasons.",
        communityImpact: "Provides sustainable livelihood for remote Arctic communities and funds cultural preservation.",
        researchPapers: [
          { title: "Adaptogenic Properties of Arctic Rhodiola", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "echinacea-extract",
        name: "Echinacea Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Immune system support from Indigenous traditional medicine. Certified organic cultivation and ethical partnerships.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Immune system support from Indigenous traditional medicine",
        price: "34.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Echinacea",
        productType: "Standardized extract powder",
        rating: "4.5",
        reviewCount: 112,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-ECH-006",
        scientificName: "Echinacea purpurea",
        extractionMethod: "Standardized Alcohol Extraction",
        bioactiveCompounds: ["Alkamides", "Polyphenols", "Polysaccharides"],
        certifications: ["Organic", "Native Partnership", "USDA Certified"],
        sustainabilityStory: "Grown on tribal lands using traditional companion planting methods.",
        communityImpact: "Partnership with Native American tribes supports cultural education and healthcare programs.",
        researchPapers: [
          { title: "Immunomodulatory Effects of Echinacea Extracts", url: "#", year: 2023 }
        ],
        inStock: true
      },
      {
        id: "green-tea-extract",
        name: "Green Tea Extract",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. EGCG-rich antioxidant powerhouse. Traditional tea ceremony meets scientific extraction for maximum bioavailability.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. EGCG-rich antioxidant powerhouse",
        price: "27.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements", 
        plantMaterial: "Green Tea",
        productType: "Standardized extract powder",
        rating: "4.8",
        reviewCount: 203,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-GTE-007",
        scientificName: "Camellia sinensis",
        extractionMethod: "Water-Ethanol Extraction",
        bioactiveCompounds: ["EGCG", "Catechins", "L-Theanine"],
        certifications: ["Organic", "Japanese Agricultural Standard", "Fair Trade"],
        sustainabilityStory: "Harvested from high-altitude tea gardens using traditional Japanese cultivation methods.",
        communityImpact: "Supports small-scale tea farmers and preserves traditional tea ceremony culture.",
        researchPapers: [
          { title: "Antioxidant Activity of Green Tea Polyphenols", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "milk-thistle",
        name: "Milk Thistle",
        description: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Liver support with 80% silymarin content. Ancient herbal tradition refined with modern extraction technology.",
        shortDescription: "Sourcing: The Cheslatta Carrier Nation's traditional and sacred territory. Liver support with 80% silymarin content",
        price: "37.99",
        origin: "Cheslatta Carrier Nation Territory, British Columbia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Milk Thistle",
        productType: "Standardized extract powder",
        rating: "4.7",
        reviewCount: 84,
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        qrCode: "RUTZ-MIL-008",
        scientificName: "Silybum marianum",
        extractionMethod: "Solvent-Free Extraction",
        bioactiveCompounds: ["Silymarin", "Silybin", "Silychristin"],
        certifications: ["Organic", "Mediterranean Certified", "Hepatoprotective Validated"],
        sustainabilityStory: "Wild-collected from Mediterranean hillsides using sustainable harvesting practices.",
        communityImpact: "Supports rural Mediterranean communities and traditional herbal knowledge preservation.",
        researchPapers: [
          { title: "Hepatoprotective Effects of Standardized Milk Thistle", url: "#", year: 2023 }
        ],
        inStock: true
      }
    ];

    productData.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize supply chain steps
    const stepData: SupplyChainStep[] = [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Sustainable Sourcing",
        description: "Ethical harvesting with complete transparency from root to extract",
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        details: "Our botanical ingredients are sourced through ethical partnerships that honor traditional knowledge while ensuring environmental sustainability. Each harvest location is carefully selected for optimal growing conditions and sustainable practices that preserve ecosystems for future generations.",
        location: "Certified organic farms and wild-harvest partners worldwide",
        certifications: ["Organic Certified", "Fair Trade", "Sustainable Harvest"]
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Precision Extraction",
        description: "Advanced biotechnology preserves nature's potency with heritage craftsmanship",
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        details: "Our extraction processes merge heritage craftsmanship with cutting-edge biotechnology. Using supercritical CO₂ extraction, we preserve delicate bioactive compounds while achieving pharmaceutical-grade purity. Every step honors both traditional wisdom and modern innovation.",
        location: "Fraunhofer Institute, Germany",
        certifications: ["GMP Certified", "Fraunhofer Validated", "ISO 9001"]
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "Purity Validation",
        description: "Every drop, every gram verified for maximum potency and transparency",
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        details: "Every batch undergoes comprehensive testing for purity, potency, heavy metals, pesticides, and microbials. Our state-of-the-art laboratory ensures only the highest quality extracts reach our customers.",
        location: "Certified Testing Laboratory, Germany",
        certifications: ["ISO 17025", "FDA Registered", "European Pharmacopoeia"]
      },
      {
        id: "step-4",
        stepNumber: 4,
        title: "Sustainable Packaging",
        description: "Biodegradable materials with QR tracking for complete transparency",
        imageUrl: "/assets/chaga-extract-powder-branded.png",
        details: "Our packaging uses biodegradable materials and minimal plastic. Each product includes a unique QR code linking to its complete supply chain story, from harvest to delivery.",
        location: "Sustainable Packaging Facility, Germany",
        certifications: ["Biodegradable Certified", "Carbon Neutral", "Recyclable"]
      }
    ];

    stepData.forEach(step => {
      this.supplyChainSteps.set(step.id, step);
    });

    // Initialize impact metrics
    this.impactMetrics = {
      id: "impact-2024",
      schoolsBuilt: 12,
      familiesSupported: 1247,
      hectaresProtected: 3890,
      amountReinvested: "2300000.00",
      researchPapers: 47,
      clinicalTrials: 23,
      patents: 12
    };

    // Initialize community projects
    this.initializeCommunityProjects();
    this.initializeLiveUpdates();
    this.initializeMilestones();
  }

  private initializeCommunityProjects() {
    const projects: CommunityProject[] = [
      {
        id: "proj-001",
        name: "Kenora First Nation School",
        description: "Building a new elementary school for 120 children in Kenora First Nation community, featuring traditional learning spaces and modern technology.",
        location: "Kenora, Ontario, Canada",
        community: "Kenora First Nation",
        category: "education",
        status: "active",
        progress: 75,
        fundingGoal: "450000.00",
        currentFunding: "337500.00",
        startDate: new Date("2024-03-15"),
        targetCompletionDate: new Date("2025-06-30"),
        completionDate: null,
        beneficiaries: 120,
        createdAt: new Date("2024-03-01"),
        lastUpdated: new Date("2024-08-15"),
      },
      {
        id: "proj-002", 
        name: "Sustainable Chaga Harvesting Program",
        description: "Training program for sustainable Chaga mushroom harvesting techniques with 25 indigenous families, preserving traditional knowledge while ensuring ecosystem health.",
        location: "Thunder Bay, Ontario, Canada",
        community: "Ojibwe Nation",
        category: "environment",
        status: "active",
        progress: 60,
        fundingGoal: "125000.00",
        currentFunding: "75000.00",
        startDate: new Date("2024-05-01"),
        targetCompletionDate: new Date("2025-04-30"),
        completionDate: null,
        beneficiaries: 25,
        createdAt: new Date("2024-04-15"),
        lastUpdated: new Date("2024-08-14"),
      },
      {
        id: "proj-003",
        name: "Traditional Medicine Center",
        description: "Community health center integrating traditional indigenous medicine with modern healthcare, serving 500+ community members.",
        location: "Winnipeg, Manitoba, Canada",
        community: "Dakota Nation",
        category: "healthcare",
        status: "planning",
        progress: 25,
        fundingGoal: "750000.00",
        currentFunding: "187500.00",
        startDate: new Date("2025-01-15"),
        targetCompletionDate: new Date("2026-12-31"),
        completionDate: null,
        beneficiaries: 500,
        createdAt: new Date("2024-07-01"),
        lastUpdated: new Date("2024-08-10"),
      },
      {
        id: "proj-004",
        name: "Indigenous Language Preservation",
        description: "Digital archive and education program preserving Cree language and traditional plant knowledge for future generations.",
        location: "Saskatchewan, Canada",
        community: "Plains Cree Nation",
        category: "education",
        status: "completed",
        progress: 100,
        fundingGoal: "95000.00",
        currentFunding: "95000.00",
        startDate: new Date("2023-09-01"),
        targetCompletionDate: new Date("2024-08-31"),
        completionDate: new Date("2024-08-20"),
        beneficiaries: 200,
        createdAt: new Date("2023-08-15"),
        lastUpdated: new Date("2024-08-20"),
      }
    ];

    projects.forEach(project => {
      this.communityProjects.set(project.id, project);
    });
  }

  private initializeLiveUpdates() {
    this.liveImpactUpdates = [
      {
        id: "update-001",
        projectId: "proj-001",
        updateType: "progress",
        title: "School Construction 75% Complete",
        description: "Foundation completed, walls erected, and roofing installation in progress. Expected completion ahead of schedule.",
        previousValue: "65.00",
        newValue: "75.00",
        impactMetric: "progress",
        isPublic: true,
        createdAt: new Date("2024-08-15T14:30:00Z"),
      },
      {
        id: "update-002",
        projectId: "proj-002",
        updateType: "funding",
        title: "Additional Funding Secured",
        description: "Community fundraising event raised additional $15,000 for sustainable harvesting equipment.",
        previousValue: "60000.00",
        newValue: "75000.00",
        impactMetric: "currentFunding",
        isPublic: true,
        createdAt: new Date("2024-08-14T10:15:00Z"),
      },
      {
        id: "update-003",
        projectId: "proj-004",
        updateType: "completion",
        title: "Language Archive Project Completed",
        description: "Successfully digitized 500+ traditional plant knowledge recordings and created interactive learning platform.",
        previousValue: "95.00",
        newValue: "100.00", 
        impactMetric: "progress",
        isPublic: true,
        createdAt: new Date("2024-08-20T16:45:00Z"),
      },
      {
        id: "update-004",
        projectId: "proj-003",
        updateType: "milestone",
        title: "Site Planning Approved",
        description: "Traditional Medicine Center site plans approved by community council and local authorities.",
        previousValue: "15.00",
        newValue: "25.00",
        impactMetric: "progress", 
        isPublic: true,
        createdAt: new Date("2024-08-10T09:20:00Z"),
      },
      {
        id: "update-005",
        projectId: "proj-001",
        updateType: "milestone",
        title: "Traditional Learning Space Dedicated",
        description: "Elder Mary Sinclair blessed the new traditional learning space with sacred ceremony.",
        previousValue: null,
        newValue: null,
        impactMetric: null,
        isPublic: true,
        createdAt: new Date("2024-08-12T11:00:00Z"),
      }
    ];
  }

  private initializeMilestones() {
    const milestones: ImpactMilestone[] = [
      {
        id: "mile-001",
        projectId: "proj-001", 
        title: "Foundation Complete",
        description: "School foundation and basement construction finished",
        targetDate: new Date("2024-06-30"),
        achievedDate: new Date("2024-06-25"),
        isAchieved: true,
        celebrationMessage: "Foundation blessed by community elders in traditional ceremony",
        impactValue: 25,
        createdAt: new Date("2024-03-15"),
      },
      {
        id: "mile-002",
        projectId: "proj-001",
        title: "Roof Installation",
        description: "Complete roofing system installation for weather protection",
        targetDate: new Date("2024-09-15"),
        achievedDate: null,
        isAchieved: false,
        celebrationMessage: null,
        impactValue: 50,
        createdAt: new Date("2024-03-15"),
      },
      {
        id: "mile-003",
        projectId: "proj-002",
        title: "First Harvest Training",
        description: "Complete first sustainable harvesting training with 10 families",
        targetDate: new Date("2024-10-31"),
        achievedDate: null,
        isAchieved: false,
        celebrationMessage: null,
        impactValue: 40,
        createdAt: new Date("2024-05-01"),
      },
      {
        id: "mile-004",
        projectId: "proj-004",
        title: "Archive Launch",
        description: "Launch digital platform for community use",
        targetDate: new Date("2024-08-15"),
        achievedDate: new Date("2024-08-20"),
        isAchieved: true,
        celebrationMessage: "Over 200 community members registered on launch day",
        impactValue: 100,
        createdAt: new Date("2023-09-01"),
      }
    ];

    milestones.forEach(milestone => {
      this.impactMilestones.set(milestone.id, milestone);
    });
  }

  // Community Impact Tracking Methods
  async getCommunityProjects(): Promise<CommunityProject[]> {
    return Array.from(this.communityProjects.values()).sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }

  async getCommunityProject(id: string): Promise<CommunityProject | undefined> {
    return this.communityProjects.get(id);
  }

  async createCommunityProject(insertProject: InsertCommunityProject): Promise<CommunityProject> {
    const id = randomUUID();
    const now = new Date();
    const project: CommunityProject = {
      ...insertProject,
      id,
      createdAt: now,
      lastUpdated: now,
    };
    this.communityProjects.set(id, project);
    return project;
  }

  async updateCommunityProject(id: string, updates: Partial<InsertCommunityProject>): Promise<CommunityProject | undefined> {
    const project = this.communityProjects.get(id);
    if (!project) return undefined;

    const updatedProject: CommunityProject = {
      ...project,
      ...updates,
      lastUpdated: new Date(),
    };
    
    this.communityProjects.set(id, updatedProject);
    return updatedProject;
  }

  async getLiveImpactUpdates(limit: number = 20): Promise<LiveImpactUpdate[]> {
    return this.liveImpactUpdates
      .filter(update => update.isPublic)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createLiveImpactUpdate(insertUpdate: InsertLiveImpactUpdate): Promise<LiveImpactUpdate> {
    const id = randomUUID();
    const update: LiveImpactUpdate = {
      ...insertUpdate,
      id,
      createdAt: new Date(),
    };
    this.liveImpactUpdates.unshift(update);
    return update;
  }

  async getImpactMilestones(projectId?: string): Promise<ImpactMilestone[]> {
    const milestones = Array.from(this.impactMilestones.values());
    if (projectId) {
      return milestones.filter(m => m.projectId === projectId);
    }
    return milestones.sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime());
  }

  async createImpactMilestone(insertMilestone: InsertImpactMilestone): Promise<ImpactMilestone> {
    const id = randomUUID();
    const milestone: ImpactMilestone = {
      ...insertMilestone,
      id,
      createdAt: new Date(),
    };
    this.impactMilestones.set(id, milestone);
    return milestone;
  }

  async updateImpactMilestone(id: string, updates: Partial<InsertImpactMilestone>): Promise<ImpactMilestone | undefined> {
    const milestone = this.impactMilestones.get(id);
    if (!milestone) return undefined;

    const updatedMilestone: ImpactMilestone = {
      ...milestone,
      ...updates,
    };
    
    this.impactMilestones.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      scientificName: insertProduct.scientificName || null,
      extractionMethod: insertProduct.extractionMethod || null,
      bioactiveCompounds: Array.isArray(insertProduct.bioactiveCompounds) ? insertProduct.bioactiveCompounds : null,
      certifications: Array.isArray(insertProduct.certifications) ? insertProduct.certifications : null,
      sustainabilityStory: insertProduct.sustainabilityStory || null,
      communityImpact: insertProduct.communityImpact || null,
      researchPapers: Array.isArray(insertProduct.researchPapers) ? insertProduct.researchPapers : null,
      inStock: insertProduct.inStock ?? true
    };
    this.products.set(id, product);
    return product;
  }

  async getSupplyChainSteps(): Promise<SupplyChainStep[]> {
    return Array.from(this.supplyChainSteps.values()).sort((a, b) => a.stepNumber - b.stepNumber);
  }

  async getSupplyChainStep(id: string): Promise<SupplyChainStep | undefined> {
    return this.supplyChainSteps.get(id);
  }

  async getImpactMetrics(): Promise<ImpactMetrics> {
    return this.impactMetrics;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product); // Filter out items with missing products
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const keysToDelete: string[] = [];
    this.cartItems.forEach((item, key) => {
      if (item.sessionId === sessionId) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cartItems.delete(key));
  }

  // Personalized Recommendations Implementation
  async getUserPreferences(sessionId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(pref => pref.sessionId === sessionId);
  }

  async saveUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = randomUUID();
    const preferences: UserPreferences = {
      ...insertPreferences,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userPreferences.set(id, preferences);
    return preferences;
  }

  async generateRecommendations(sessionId: string, preferences: any): Promise<RecommendationResults> {
    // Save user preferences first
    const savedPreferences = await this.saveUserPreferences({
      sessionId,
      healthGoals: preferences.healthGoals || [],
      lifestyle: preferences.lifestyle || 'moderate',
      dietaryRestrictions: preferences.dietaryRestrictions || [],
      preferredFormats: preferences.preferredFormats || [],
      budgetRange: preferences.budgetRange || 'medium',
      experienceLevel: preferences.experienceLevel || 'beginner',
      specificConcerns: preferences.specificConcerns || [],
    });

    // Generate recommendations based on preferences
    const products = Array.from(this.products.values());
    const recommendedProducts = this.calculateProductRecommendations(products, preferences);
    
    const id = randomUUID();
    const recommendations: RecommendationResults = {
      id,
      sessionId,
      userPreferencesId: savedPreferences.id,
      recommendedProducts,
      explanation: this.generateExplanation(preferences, recommendedProducts),
      confidenceScore: "0.85",
      createdAt: new Date(),
    };

    this.recommendationResults.set(sessionId, recommendations);
    return recommendations;
  }

  async getRecommendations(sessionId: string): Promise<RecommendationResults | undefined> {
    return this.recommendationResults.get(sessionId);
  }

  private calculateProductRecommendations(products: Product[], preferences: any) {
    const scored = products.map(product => {
      let score = 0.5; // Base score
      let reason = "General botanical wellness support";
      let priority = 3;

      // Health goals matching
      if (preferences.healthGoals?.includes('immune_support') && 
          (product.plantMaterial.toLowerCase().includes('chaga') || 
           product.plantMaterial.toLowerCase().includes('echinacea'))) {
        score += 0.3;
        reason = "Excellent for immune system support based on your goals";
        priority = 1;
      }

      if (preferences.healthGoals?.includes('stress_relief') && 
          (product.plantMaterial.toLowerCase().includes('ashwagandha') || 
           product.plantMaterial.toLowerCase().includes('rhodiola'))) {
        score += 0.3;
        reason = "Perfect for stress management and adaptation";
        priority = 1;
      }

      if (preferences.healthGoals?.includes('energy_boost') && 
          (product.plantMaterial.toLowerCase().includes('ginseng') || 
           product.plantMaterial.toLowerCase().includes('rhodiola'))) {
        score += 0.25;
        reason = "Natural energy enhancement without stimulants";
        priority = 2;
      }

      // Format preferences
      if (preferences.preferredFormats?.includes('tea') && 
          product.productType.toLowerCase().includes('tea')) {
        score += 0.15;
      }

      if (preferences.preferredFormats?.includes('capsules') && 
          product.productType.toLowerCase().includes('capsule')) {
        score += 0.15;
      }

      if (preferences.preferredFormats?.includes('powder') && 
          product.productType.toLowerCase().includes('powder')) {
        score += 0.15;
      }

      // Experience level adjustment
      if (preferences.experienceLevel === 'beginner' && 
          product.productType.toLowerCase().includes('tea')) {
        score += 0.1;
        reason += " - Great for beginners";
      }

      // Budget considerations
      const price = parseFloat(product.price);
      if (preferences.budgetRange === 'low' && price < 30) {
        score += 0.1;
      } else if (preferences.budgetRange === 'medium' && price >= 30 && price <= 80) {
        score += 0.1;
      } else if (preferences.budgetRange === 'high' && price > 80) {
        score += 0.1;
      }

      return {
        productId: product.id,
        score: Math.min(score, 1.0),
        reason,
        priority
      };
    });

    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score || a.priority - b.priority)
      .slice(0, 6);
  }

  private generateExplanation(preferences: any, recommendations: any[]): string {
    const goals = preferences.healthGoals || [];
    const topRec = recommendations[0];
    
    let explanation = `Based on your health goals of ${goals.slice(0, 2).join(' and ')}, `;
    explanation += `we've identified ${recommendations.length} botanical extracts that align with your needs. `;
    
    if (topRec && topRec.score > 0.8) {
      explanation += `Our top recommendation has a ${Math.round(topRec.score * 100)}% compatibility match with your preferences.`;
    } else {
      explanation += `These recommendations are tailored to your experience level and preferred formats.`;
    }

    return explanation;
  }

  // Initialize Global Indigenous Plants Data from PDF
  private initializeGlobalIndigenousPlants() {
    const plantsData: GlobalIndigenousPlant[] = [
      // North American Indigenous Plants
      {
        id: "echinacea-purpurea",
        plantName: "Purple Coneflower",
        scientificName: "Echinacea purpurea",
        region: "North America",
        countryOfOrigin: "United States, Canada",
        traditionalUses: "Immune system support, wound healing, respiratory infections, snake bites",
        popularProductForm: "Tinctures, capsules, dried root powder",
        timeframe: "Traditional use for over 400 years",
        indigenousTribesOrGroup: "Plains Indians, Cherokee, Lakota, Dakota",
        associatedCeremony: "Healing ceremonies, purification rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "goldenseal",
        plantName: "Goldenseal",
        scientificName: "Hydrastis canadensis",
        region: "North America",
        countryOfOrigin: "Eastern United States, Southern Canada",
        traditionalUses: "Digestive disorders, eye infections, respiratory ailments, skin conditions",
        popularProductForm: "Root powder, tinctures, eye drops",
        timeframe: "Used traditionally for over 300 years",
        indigenousTribesOrGroup: "Cherokee, Iroquois, Kickapoo",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "american-ginseng",
        plantName: "American Ginseng",
        scientificName: "Panax quinquefolius",
        region: "North America",
        countryOfOrigin: "Eastern United States, Southern Canada",
        traditionalUses: "Energy enhancement, stress adaptation, digestive support, respiratory health",
        popularProductForm: "Root extracts, capsules, teas",
        timeframe: "Traditional use for over 500 years",
        indigenousTribesOrGroup: "Ojibwe, Menominee, Potawatomi",
        associatedCeremony: "Medicine lodge ceremonies, seasonal rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "white-willow",
        plantName: "White Willow",
        scientificName: "Salix alba",
        region: "North America",
        countryOfOrigin: "Northern United States, Canada",
        traditionalUses: "Pain relief, fever reduction, inflammation, headaches",
        popularProductForm: "Bark extracts, teas, capsules",
        timeframe: "Traditional use for over 400 years",
        indigenousTribesOrGroup: "Chippewa, Cree, Blackfoot",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "bloodroot",
        plantName: "Bloodroot",
        scientificName: "Sanguinaria canadensis",
        region: "North America",
        countryOfOrigin: "Eastern United States, Eastern Canada",
        traditionalUses: "Respiratory conditions, skin lesions, dental health, wound healing",
        popularProductForm: "Root tinctures, topical preparations",
        timeframe: "Traditional use for over 300 years",
        indigenousTribesOrGroup: "Algonquin, Huron, Delaware",
        associatedCeremony: "Purification rituals, healing ceremonies",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // South American Indigenous Plants
      {
        id: "cat-claw",
        plantName: "Cat's Claw",
        scientificName: "Uncaria tomentosa",
        region: "South America",
        countryOfOrigin: "Peru, Brazil, Colombia, Ecuador",
        traditionalUses: "Immune system modulation, arthritis, digestive disorders, viral infections",
        popularProductForm: "Bark extracts, capsules, teas",
        timeframe: "Traditional use for over 2000 years",
        indigenousTribesOrGroup: "Asháninka, Shipibo, Aguaruna, Cashibo",
        associatedCeremony: "Healing rituals, shamanic ceremonies",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "maca-root",
        plantName: "Maca",
        scientificName: "Lepidium meyenii",
        region: "South America",
        countryOfOrigin: "Peru (Andes Mountains)",
        traditionalUses: "Energy enhancement, hormonal balance, fertility, endurance",
        popularProductForm: "Root powder, capsules, extracts",
        timeframe: "Traditional cultivation for over 3000 years",
        indigenousTribesOrGroup: "Quechua, Inca descendants",
        associatedCeremony: "Harvest festivals, fertility rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "dragon-blood",
        plantName: "Dragon's Blood",
        scientificName: "Croton lechleri",
        region: "South America",
        countryOfOrigin: "Peru, Ecuador, Brazil, Colombia",
        traditionalUses: "Wound healing, gastrointestinal disorders, antimicrobial applications",
        popularProductForm: "Resin extracts, topical gels, liquid preparations",
        timeframe: "Traditional use for over 1500 years",
        indigenousTribesOrGroup: "Shipibo, Awajún, Achuar, Cocama",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "guarana",
        plantName: "Guarana",
        scientificName: "Paullinia cupana",
        region: "South America",
        countryOfOrigin: "Brazil (Amazon Basin)",
        traditionalUses: "Energy enhancement, cognitive function, weight management, cardiovascular health",
        popularProductForm: "Seed extracts, energy drinks, capsules",
        timeframe: "Traditional use for over 1000 years",
        indigenousTribesOrGroup: "Guaraní, Satéré-Mawé",
        associatedCeremony: "Harvest ceremonies, energy rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "camu-camu",
        plantName: "Camu Camu",
        scientificName: "Myrciaria dubia",
        region: "South America",
        countryOfOrigin: "Peru, Brazil (Amazon rainforest)",
        traditionalUses: "Vitamin C source, immune support, antioxidant protection, mood enhancement",
        popularProductForm: "Fruit powder, capsules, vitamin supplements",
        timeframe: "Traditional use for over 800 years",
        indigenousTribesOrGroup: "Shipibo, Yagua, Cocama",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Caribbean Indigenous Plants
      {
        id: "soursop",
        plantName: "Soursop",
        scientificName: "Annona muricata",
        region: "Caribbean",
        countryOfOrigin: "Caribbean Islands, Central America",
        traditionalUses: "Cancer support, immune enhancement, parasitic infections, digestive health",
        popularProductForm: "Leaf teas, fruit extracts, capsules",
        timeframe: "Traditional use for over 600 years",
        indigenousTribesOrGroup: "Taíno, Arawak, Carib",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "caribbean-vervain",
        plantName: "Caribbean Vervain",
        scientificName: "Stachytarpheta jamaicensis",
        region: "Caribbean",
        countryOfOrigin: "Jamaica, Haiti, Dominican Republic",
        traditionalUses: "Respiratory conditions, fever reduction, digestive disorders, wound healing",
        popularProductForm: "Leaf teas, tinctures, poultices",
        timeframe: "Traditional use for over 400 years",
        indigenousTribesOrGroup: "Maroons, Rastafari communities",
        associatedCeremony: "Healing prayers, spiritual cleansing",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "bissy-nut",
        plantName: "Bissy Nut",
        scientificName: "Cola acuminata",
        region: "Caribbean",
        countryOfOrigin: "Jamaica, originally from West Africa",
        traditionalUses: "Digestive issues, energy enhancement, mental clarity, nausea relief",
        popularProductForm: "Ground nuts, teas, tinctures",
        timeframe: "Traditional use for over 300 years in Caribbean",
        indigenousTribesOrGroup: "Jamaican Maroons, Afro-Caribbean communities",
        associatedCeremony: "Healing rituals, community gatherings",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Australian Indigenous Plants
      {
        id: "tea-tree",
        plantName: "Tea Tree",
        scientificName: "Melaleuca alternifolia",
        region: "Australia",
        countryOfOrigin: "Eastern Australia",
        traditionalUses: "Antimicrobial applications, skin conditions, respiratory issues, wound healing",
        popularProductForm: "Essential oils, topical creams, soaps",
        timeframe: "Traditional use for over 40,000 years",
        indigenousTribesOrGroup: "Bundjalung Aboriginal peoples",
        associatedCeremony: "Healing smoke ceremonies, medicinal preparation rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "eucalyptus",
        plantName: "Eucalyptus",
        scientificName: "Eucalyptus globulus",
        region: "Australia",
        countryOfOrigin: "Southeastern Australia",
        traditionalUses: "Respiratory conditions, antiseptic applications, fever reduction, muscle pain",
        popularProductForm: "Essential oils, chest rubs, inhalants",
        timeframe: "Traditional use for over 40,000 years",
        indigenousTribesOrGroup: "Various Aboriginal tribes across Australia",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "lemon-myrtle",
        plantName: "Lemon Myrtle",
        scientificName: "Backhousia citriodora",
        region: "Australia",
        countryOfOrigin: "Subtropical rainforests of Queensland",
        traditionalUses: "Antimicrobial, digestive health, respiratory support, culinary seasoning",
        popularProductForm: "Essential oils, dried leaves, food seasonings",
        timeframe: "Traditional use for over 40,000 years",
        indigenousTribesOrGroup: "Yuggera, Bundjalung peoples",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "kakadu-plum",
        plantName: "Kakadu Plum",
        scientificName: "Terminalia ferdinandiana",
        region: "Australia",
        countryOfOrigin: "Northern Australia",
        traditionalUses: "High vitamin C source, antioxidant support, immune enhancement, skin health",
        popularProductForm: "Fruit extracts, vitamin supplements, skincare products",
        timeframe: "Traditional use for over 40,000 years",
        indigenousTribesOrGroup: "Yolŋu, Larrakia, Tiwi peoples",
        associatedCeremony: "Seasonal harvest ceremonies, Dreamtime stories",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // New Zealand Indigenous Plants
      {
        id: "manuka",
        plantName: "Manuka",
        scientificName: "Leptospermum scoparium",
        region: "New Zealand",
        countryOfOrigin: "New Zealand",
        traditionalUses: "Wound healing, digestive health, antimicrobial applications, skin conditions",
        popularProductForm: "Honey, essential oils, topical preparations",
        timeframe: "Traditional use for over 700 years",
        indigenousTribesOrGroup: "Māori people",
        associatedCeremony: "Rongoā Māori (traditional healing), ceremonial preparations",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "kawakawa",
        plantName: "Kawakawa",
        scientificName: "Piper excelsum",
        region: "New Zealand",
        countryOfOrigin: "New Zealand",
        traditionalUses: "Pain relief, digestive disorders, respiratory conditions, skin healing",
        popularProductForm: "Leaf extracts, teas, topical balms",
        timeframe: "Traditional use for over 700 years",
        indigenousTribesOrGroup: "Māori people",
        associatedCeremony: "Rongoā Māori healing practices, ceremonial teas",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "horopito",
        plantName: "Horopito",
        scientificName: "Pseudowintera colorata",
        region: "New Zealand",
        countryOfOrigin: "New Zealand",
        traditionalUses: "Antimicrobial applications, digestive health, respiratory support, skin conditions",
        popularProductForm: "Leaf extracts, capsules, topical preparations",
        timeframe: "Traditional use for over 700 years",
        indigenousTribesOrGroup: "Māori people",
        associatedCeremony: "Traditional healing ceremonies, plant blessing rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // African Indigenous Plants
      {
        id: "african-potato",
        plantName: "African Potato",
        scientificName: "Hypoxis hemerocallidea",
        region: "Africa",
        countryOfOrigin: "Southern Africa (South Africa, Zimbabwe)",
        traditionalUses: "Immune system support, prostate health, HIV/AIDS support, inflammatory conditions",
        popularProductForm: "Root extracts, capsules, tinctures",
        timeframe: "Traditional use for over 1000 years",
        indigenousTribesOrGroup: "Zulu, Xhosa, Sotho peoples",
        associatedCeremony: "Traditional healing rituals, ancestral medicine ceremonies",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sutherlandia",
        plantName: "Sutherlandia",
        scientificName: "Sutherlandia frutescens",
        region: "Africa",
        countryOfOrigin: "Southern Africa",
        traditionalUses: "Cancer support, immune enhancement, diabetes management, stress adaptation",
        popularProductForm: "Leaf extracts, teas, capsules",
        timeframe: "Traditional use for over 800 years",
        indigenousTribesOrGroup: "Khoi, San, Nama peoples",
        associatedCeremony: "Healing ceremonies, spiritual cleansing rituals",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "buchu",
        plantName: "Buchu",
        scientificName: "Barosma betulina",
        region: "Africa",
        countryOfOrigin: "South Africa (Western Cape)",
        traditionalUses: "Urinary tract health, kidney support, digestive disorders, antimicrobial applications",
        popularProductForm: "Leaf extracts, teas, capsules",
        timeframe: "Traditional use for over 1000 years",
        indigenousTribesOrGroup: "Khoi (Khoikhoi), San peoples",
        associatedCeremony: "Traditional cleansing ceremonies, healing rituals",
        veterinaryUse: "Traditional veterinary applications for livestock urinary health",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "kanna",
        plantName: "Kanna",
        scientificName: "Sceletium tortuosum",
        region: "Africa",
        countryOfOrigin: "South Africa (Karoo region)",
        traditionalUses: "Mood enhancement, anxiety relief, stress management, cognitive support",
        popularProductForm: "Dried plant material, extracts, tinctures",
        timeframe: "Traditional use for over 1000 years",
        indigenousTribesOrGroup: "San, Khoi peoples",
        associatedCeremony: "Spiritual ceremonies, meditation rituals, social gatherings",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "devils-claw",
        plantName: "Devil's Claw",
        scientificName: "Harpagophytum procumbens",
        region: "Africa",
        countryOfOrigin: "Southern Africa (Namibia, Botswana, South Africa)",
        traditionalUses: "Arthritis relief, anti-inflammatory, digestive health, pain management",
        popularProductForm: "Root extracts, capsules, teas",
        timeframe: "Traditional use for over 800 years",
        indigenousTribesOrGroup: "San, Nama, Herero peoples",
        veterinaryUse: "Traditional use for livestock joint health and inflammation",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    plantsData.forEach(plant => {
      this.globalIndigenousPlants.set(plant.id, plant);
    });
  }

  // Global Indigenous Plants Implementation
  async getGlobalIndigenousPlants(): Promise<GlobalIndigenousPlant[]> {
    return Array.from(this.globalIndigenousPlants.values());
  }

  async deleteAllGlobalIndigenousPlants(): Promise<void> {
    this.globalIndigenousPlants.clear();
  }

  async getGlobalIndigenousPlant(id: string): Promise<GlobalIndigenousPlant | undefined> {
    return this.globalIndigenousPlants.get(id);
  }

  async getPlantsByRegion(region: string): Promise<GlobalIndigenousPlant[]> {
    return Array.from(this.globalIndigenousPlants.values())
      .filter(plant => plant.region.toLowerCase() === region.toLowerCase());
  }

  async getPlantsByTribe(tribe: string): Promise<GlobalIndigenousPlant[]> {
    return Array.from(this.globalIndigenousPlants.values())
      .filter(plant => plant.indigenousTribesOrGroup.toLowerCase().includes(tribe.toLowerCase()));
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
    let results = Array.from(this.globalIndigenousPlants.values());

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(plant =>
        plant.plantName.toLowerCase().includes(term) ||
        plant.scientificName.toLowerCase().includes(term) ||
        plant.traditionalUses.toLowerCase().includes(term) ||
        plant.indigenousTribesOrGroup.toLowerCase().includes(term)
      );
    }

    if (filters.region) {
      results = results.filter(plant => 
        plant.region.toLowerCase() === filters.region.toLowerCase()
      );
    }

    if (filters.country) {
      results = results.filter(plant => 
        plant.countryOfOrigin.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    if (filters.tribe) {
      results = results.filter(plant => 
        plant.indigenousTribesOrGroup.toLowerCase().includes(filters.tribe.toLowerCase())
      );
    }

    if (filters.productForm) {
      results = results.filter(plant => 
        plant.popularProductForm.toLowerCase().includes(filters.productForm.toLowerCase())
      );
    }

    if (filters.ceremonialUse) {
      results = results.filter(plant => Boolean(plant.associatedCeremony));
    }

    if (filters.veterinaryUse) {
      results = results.filter(plant => Boolean(plant.veterinaryUse));
    }

    return results;
  }
}

// Import the new database storage
import { DatabaseStorage } from "./databaseStorage";

export const storage = new DatabaseStorage();
