import { type Product, type InsertProduct, type SupplyChainStep, type InsertSupplyChainStep, type ImpactMetrics, type InsertImpactMetrics, type CartItem, type InsertCartItem, type CommunityProject, type InsertCommunityProject, type LiveImpactUpdate, type InsertLiveImpactUpdate, type ImpactMilestone, type InsertImpactMilestone, type UserPreferences, type InsertUserPreferences, type RecommendationResults, type InsertRecommendationResults } from "@shared/schema";
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

  constructor() {
    this.products = new Map();
    this.supplyChainSteps = new Map();
    this.cartItems = new Map();
    this.communityProjects = new Map();
    this.liveImpactUpdates = [];
    this.impactMilestones = new Map();
    this.userPreferences = new Map();
    this.recommendationResults = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize products with comprehensive plant-based classification
    const productData: Product[] = [
      // CHAGA MUSHROOM PRODUCTS - Full product line from raw material
      {
        id: "chaga-extract-powder",
        name: "Chaga Extract Powder - β-glucans + Triterpenes",
        description: "Standardized dry extract powder concentrated with bioactive β-glucans and triterpenes from wild-harvested Chaga mushrooms. Premium quality for immune system support and antioxidant protection.",
        shortDescription: "Standardized β-glucans and triterpenes extract powder",
        price: "89.99",
        origin: "Siberian Taiga, Russia",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Chaga Mushroom",
        productType: "Standardized dry extract powder (β-glucans + triterpenes)",
        rating: "4.9",
        reviewCount: 89,
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        qrCode: "RUTZ-CHA-001",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Water-ethanol dual extraction + standardization",
        bioactiveCompounds: ["β-glucans", "Betulinic acid", "Inotodiol", "Melanin complexes"],
        certifications: ["Wild-harvested", "Organic", "GMP Certified"],
        sustainabilityStory: "Sustainably wild-harvested from certified forests using traditional methods that ensure tree survival and ecosystem preservation.",
        communityImpact: "Supporting indigenous communities in Siberia with fair trade practices and traditional knowledge preservation programs.",
        researchPapers: [
          { title: "Immunomodulatory Effects of Chaga β-glucans", url: "#", year: 2023 },
          { title: "Antioxidant Properties of Inonotus obliquus Extracts", url: "#", year: 2024 }
        ],
        inStock: true
      },
      {
        id: "chaga-capsules",
        name: "Chaga Extract Capsules",
        description: "Convenient encapsulated chaga extract in vegetarian capsules. Each capsule contains 500mg of standardized chaga extract for daily immune support.",
        shortDescription: "500mg chaga extract in vegetarian capsules",
        price: "59.99",
        origin: "Siberian Taiga, Russia",
        category: "Capsules",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Chaga Mushroom",
        productType: "Encapsulated extract (capsules / tablets / softgels)",
        rating: "4.7",
        reviewCount: 156,
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        id: "chaga-rtd-tea",
        name: "Ready-to-Drink Chaga Tea",
        description: "Refreshing ready-to-drink chaga infusion with natural honey and lemon. Perfect for on-the-go immune support with traditional taste.",
        shortDescription: "Convenient RTD chaga tea with honey and lemon",
        price: "4.99",
        origin: "Siberian Taiga, Russia",
        category: "Beverages",
        sector: "Functional Foods & Beverages",
        plantMaterial: "Chaga Mushroom",
        productType: "RTD chaga tea / infusion",
        rating: "4.5",
        reviewCount: 203,
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        qrCode: "RUTZ-CHA-003",
        scientificName: "Inonotus obliquus",
        extractionMethod: "Hot water extraction",
        bioactiveCompounds: ["Water-soluble β-glucans", "Melanoidins"],
        certifications: ["Organic", "No artificial preservatives"],
        sustainabilityStory: "Packaged in recyclable glass bottles with minimal environmental impact.",
        communityImpact: "Each bottle sold contributes to community health programs in harvesting regions.",
        researchPapers: [
          { title: "Bioactivity of Chaga Tea Preparations", url: "#", year: 2023 }
        ],
        inStock: true
      },
      {
        id: "chaga-functional-latte",
        name: "Plant-Based Chaga Functional Latte",
        description: "Creamy plant-based latte blend with chaga extract, adaptogens, and natural flavors. Perfect morning ritual for immune support and mental clarity.",
        shortDescription: "Plant-based functional latte with chaga and adaptogens",
        price: "24.99",
        origin: "Siberian Taiga, Russia",
        category: "Latte Mixes",
        sector: "Functional Foods & Beverages",
        plantMaterial: "Chaga Mushroom",
        productType: "Plant-based functional latte (with extract)",
        rating: "4.6",
        reviewCount: 134,
        imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        description: "Luxurious anti-aging face serum enriched with chaga extract and melanin complexes. Provides powerful antioxidant protection and skin rejuvenation.",
        shortDescription: "Anti-aging serum with chaga melanin complexes",
        price: "79.99",
        origin: "Siberian Taiga, Russia",
        category: "Skincare",
        sector: "Cosmetics & Personal Care",
        plantMaterial: "Chaga Mushroom",
        productType: "Antioxidant face serum / cream",
        rating: "4.8",
        reviewCount: 92,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        description: "Advanced biomedical hydrogel with purified chaga actives for wound healing and skin regeneration. Clinical-grade formula for healthcare applications.",
        shortDescription: "Clinical-grade wound-care hydrogel with chaga actives",
        price: "149.99",
        origin: "Siberian Taiga, Russia",
        category: "Medical Devices",
        sector: "Biomedical / Pharma Leads",
        plantMaterial: "Chaga Mushroom",
        productType: "Wound-care hydrogel with chaga actives",
        rating: "4.9",
        reviewCount: 34,
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        description: "Premium curcumin with 95% bioavailability. Anti-inflammatory powerhouse backed by heritage craftsmanship. Sustainably sourced from indigenous communities in Kerala, India.",
        shortDescription: "Premium curcumin with 95% bioavailability and anti-inflammatory properties",
        price: "49.99",
        origin: "Kerala, India",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Turmeric",
        productType: "Standardized extract powder",
        rating: "4.9",
        reviewCount: 127,
        imageUrl: "https://pixabay.com/get/g8f103a3cf0b050eaa3f6ec9b7155f6ccfaae62325940ca0ac6f71bb602d5763bed528e61ace6607291f8ef8d678bcc09a7cf3ca8a04d59e3d2e3c754c0002444_1280.jpg",
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
        id: "ashwagandha-root",
        name: "Ashwagandha Root Extract",
        description: "Adaptogenic herb for stress relief and vitality. Traditional Ayurvedic wisdom meets modern extraction techniques for optimal bioactivity.",
        shortDescription: "Adaptogenic herb for stress relief and vitality with traditional Ayurvedic wisdom",
        price: "39.99",
        origin: "Rajasthan, India",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Ashwagandha",
        productType: "Standardized extract powder",
        rating: "4.8",
        reviewCount: 93,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        description: "Nutrient-dense superfood with 90+ vitamins and minerals. Sustainable community farming program supporting West African communities.",
        shortDescription: "Nutrient-dense superfood with 90+ vitamins and minerals. Sustainable community farming program.",
        price: "29.99",
        origin: "Ghana",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Moringa",
        productType: "Standardized extract powder",
        rating: "4.7",
        reviewCount: 156,
        imageUrl: "https://pixabay.com/get/g1d5bda06c085f118ab2e1a7cf68cc84418167acd81a3b7795a9168734e171f4b402622f0ecb3ed4e382cebac1e9ce691807eed839c97cf5424d9f980b5d5c156_1280.jpg",
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
        description: "Cognitive enhancement extract with standardized flavonoids. Ancient wisdom, modern purity through advanced extraction methods.",
        shortDescription: "Cognitive enhancement extract with standardized flavonoids. Ancient wisdom, modern purity.",
        price: "44.99",
        origin: "China",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Ginkgo Biloba",
        productType: "Standardized extract powder",
        rating: "4.6",
        reviewCount: 89,
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        description: "Arctic adaptogen for mental performance. Sustainably wild-harvested by indigenous communities in pristine Siberian environments.",
        shortDescription: "Arctic adaptogen for mental performance. Sustainably wild-harvested by indigenous communities.",
        price: "54.99",
        origin: "Siberia",
        category: "Extract Powders", 
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Rhodiola Rosea",
        productType: "Standardized extract powder",
        rating: "4.9",
        reviewCount: 67,
        imageUrl: "https://pixabay.com/get/gff242b33bdbe01a258f3b2ae50c7b56c2efc1dbc3cae14516a559fda8570f0829e47e28840ab0c7230f34716c4db9cc51b757bb821909585f43f4b97f486ef53_1280.jpg",
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
        description: "Immune system support from Native American traditional medicine. Certified organic cultivation and ethical partnerships.",
        shortDescription: "Immune system support from Native American traditional medicine. Certified organic cultivation.",
        price: "34.99",
        origin: "North America",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Echinacea",
        productType: "Standardized extract powder",
        rating: "4.5",
        reviewCount: 112,
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        description: "EGCG-rich antioxidant powerhouse. Traditional Japanese tea ceremony meets scientific extraction for maximum bioavailability.",
        shortDescription: "EGCG-rich antioxidant powerhouse. Traditional Japanese tea ceremony meets scientific extraction.",
        price: "27.99",
        origin: "Japan",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements", 
        plantMaterial: "Green Tea",
        productType: "Standardized extract powder",
        rating: "4.8",
        reviewCount: 203,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        description: "Liver support with 80% silymarin content. Ancient European herbal tradition refined with modern extraction technology.",
        shortDescription: "Liver support with 80% silymarin content. Ancient European herbal tradition refined.",
        price: "37.99",
        origin: "Mediterranean",
        category: "Extract Powders",
        sector: "Nutraceuticals / Supplements",
        plantMaterial: "Milk Thistle",
        productType: "Standardized extract powder",
        rating: "4.7",
        reviewCount: 84,
        imageUrl: "https://pixabay.com/get/g15eb16b2394846aa1e5b8889e51cf44746370d8610bea360ca80a1f8e55d917461d347035666cd232a864346a93d619ba345a0d3e53f755d6aca81cd3394f086_1280.jpg",
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
        imageUrl: "https://images.unsplash.com/photo-1573160013751-d4e5ceed1b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        details: "Our botanical ingredients are sourced through ethical partnerships that honor traditional knowledge while ensuring environmental sustainability. Each harvest location is carefully selected for optimal growing conditions and sustainable practices that preserve ecosystems for future generations.",
        location: "Certified organic farms and wild-harvest partners worldwide",
        certifications: ["Organic Certified", "Fair Trade", "Sustainable Harvest"]
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Precision Extraction",
        description: "Advanced biotechnology preserves nature's potency with heritage craftsmanship",
        imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        details: "Our extraction processes merge heritage craftsmanship with cutting-edge biotechnology. Using supercritical CO₂ extraction, we preserve delicate bioactive compounds while achieving pharmaceutical-grade purity. Every step honors both traditional wisdom and modern innovation.",
        location: "Fraunhofer Institute, Germany",
        certifications: ["GMP Certified", "Fraunhofer Validated", "ISO 9001"]
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "Purity Validation",
        description: "Every drop, every gram verified for maximum potency and transparency",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        details: "Every batch undergoes comprehensive testing for purity, potency, heavy metals, pesticides, and microbials. Our state-of-the-art laboratory ensures only the highest quality extracts reach our customers.",
        location: "Certified Testing Laboratory, Germany",
        certifications: ["ISO 17025", "FDA Registered", "European Pharmacopoeia"]
      },
      {
        id: "step-4",
        stepNumber: 4,
        title: "Sustainable Packaging",
        description: "Biodegradable materials with QR tracking for complete transparency",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
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
}

export const storage = new MemStorage();
