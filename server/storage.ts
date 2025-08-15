import { type Product, type InsertProduct, type SupplyChainStep, type InsertSupplyChainStep, type ImpactMetrics, type InsertImpactMetrics, type CartItem, type InsertCartItem } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private supplyChainSteps: Map<string, SupplyChainStep>;
  private impactMetrics!: ImpactMetrics;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.products = new Map();
    this.supplyChainSteps = new Map();
    this.cartItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize products
    const productData: Product[] = [
      {
        id: "turmeric-extract",
        name: "Turmeric Extract",
        description: "Premium curcumin with 95% bioavailability. Anti-inflammatory powerhouse backed by Fraunhofer research. Sustainably sourced from indigenous communities in Kerala, India.",
        shortDescription: "Premium curcumin with 95% bioavailability. Anti-inflammatory powerhouse backed by Fraunhofer research.",
        price: "49.99",
        origin: "Sourced from Kerala, India",
        category: "extracts",
        rating: "4.9",
        reviewCount: 127,
        imageUrl: "https://pixabay.com/get/g8f103a3cf0b050eaa3f6ec9b7155f6ccfaae62325940ca0ac6f71bb602d5763bed528e61ace6607291f8ef8d678bcc09a7cf3ca8a04d59e3d2e3c754c0002444_1280.jpg",
        qrCode: "RUTZ-TUR-001",
        scientificName: "Curcuma longa",
        extractionMethod: "CO2 Supercritical Extraction",
        bioactiveCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin"],
        certifications: ["Organic", "Fair Trade", "Fraunhofer Validated"],
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
        name: "Ashwagandha Root",
        description: "Adaptogenic herb for stress relief and vitality. Traditional Ayurvedic wisdom meets modern extraction techniques for optimal bioactivity.",
        shortDescription: "Adaptogenic herb for stress relief and vitality. Traditional Ayurvedic wisdom meets modern extraction.",
        price: "39.99",
        origin: "Sourced from Rajasthan, India",
        category: "extracts",
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
        origin: "Sourced from Ghana",
        category: "supplements",
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
        origin: "Sourced from China",
        category: "extracts",
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
        origin: "Sourced from Siberia",
        category: "extracts",
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
        origin: "Sourced from North America",
        category: "supplements",
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
        origin: "Sourced from Japan",
        category: "supplements",
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
        origin: "Sourced from Mediterranean",
        category: "extracts",
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
        title: "Indigenous Harvest",
        description: "Traditional knowledge guides sustainable wild-harvesting in pristine environments",
        imageUrl: "https://pixabay.com/get/g4c0c8a0aec2fbef1592fc473c6b533d368b985d90b81f5a93f830b75c83faddc2f3c7ba45c6a607a460d337b34b65797c5b0a98de1cd640acd132848a4b4e720_1280.jpg",
        details: "Our indigenous partners use ancestral knowledge to identify optimal harvest times and locations. Each plant is collected with respect for the ecosystem, ensuring sustainable regeneration for future generations.",
        location: "Various indigenous territories worldwide",
        certifications: ["Fair Trade", "Indigenous Partnership", "Sustainable Harvest"]
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Cold Chain Extraction",
        description: "CO₂ extraction preserves bioactive compounds using Fraunhofer technology",
        imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        details: "Advanced supercritical CO₂ extraction maintains the integrity of delicate bioactive compounds. Our Fraunhofer-developed process operates at optimal temperatures and pressures to maximize potency.",
        location: "Fraunhofer Institute, Germany",
        certifications: ["GMP Certified", "Fraunhofer Validated", "ISO 9001"]
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "QA Lab Testing",
        description: "Rigorous purity testing ensures safety and potency standards",
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
}

export const storage = new MemStorage();
