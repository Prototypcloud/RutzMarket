import { db } from "./db";
import {
  products,
  supplyChainSteps,
  impactMetrics,
  communityProjects,
  liveImpactUpdates,
  impactMilestones,
  learningModules,
  badges,
  journeyStages,
  inventory,
  type InsertProduct,
  type InsertSupplyChainStep,
  type InsertCommunityProject,
  type InsertLiveImpactUpdate,
  type InsertImpactMilestone,
  type InsertLearningModule,
  type InsertBadge,

  type InsertInventory,
} from "@shared/schema";

export async function initializeDatabase() {
  console.log("Initializing database with sample data...");

  // Check if data already exists
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length > 0) {
    console.log("Database already has data, skipping initialization");
    return;
  }

  // Initialize products
  const productData: InsertProduct[] = [
    {
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
      bioactiveCompounds: ["β-glucans", "Betulinic acid", "Inotodiol", "Melanin complexes"] as string[],
      certifications: ["Wild-harvested", "Organic", "GMP Certified"] as string[],
      sustainabilityStory: "Sustainably wild-harvested from certified forests using traditional methods that ensure tree survival and ecosystem preservation.",
      communityImpact: "Supporting indigenous communities in Siberia with fair trade practices and traditional knowledge preservation programs.",
      researchPapers: [
        { title: "Immunomodulatory Effects of Chaga β-glucans", url: "#", year: 2023 },
        { title: "Antioxidant Properties of Inonotus obliquus Extracts", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
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
      imageUrl: "https://images.unsplash.com/photo-1615485925600-97e5e2e9e6a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-TUR-001",
      scientificName: "Curcuma longa",
      extractionMethod: "CO2 Supercritical Extraction",
      bioactiveCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin"] as string[],
      certifications: ["Organic", "Fair Trade", "Heritage Validated"] as string[],
      sustainabilityStory: "Harvested by traditional farming cooperatives in Kerala using ancient cultivation methods passed down through generations.",
      communityImpact: "Every purchase supports 50 farming families and funds clean water projects in rural Kerala.",
      researchPapers: [
        { title: "Bioavailability Enhancement of Curcumin via CO2 Extraction", url: "#", year: 2023 },
        { title: "Anti-inflammatory Properties of Indigenous Turmeric Varieties", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
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
      bioactiveCompounds: ["Withanolides", "Alkaloids", "Saponins"] as string[],
      certifications: ["Organic", "Fair Trade", "Ayurvedic Validated"] as string[],
      sustainabilityStory: "Wild-harvested by indigenous communities using sustainable practices that preserve root systems.",
      communityImpact: "Supports traditional knowledge keepers and funds educational programs in rural Rajasthan.",
      researchPapers: [
        { title: "Adaptogenic Properties of Standardized Ashwagandha Extract", url: "#", year: 2023 }
      ],
      inStock: true
    }
  ];

  const createdProducts = await db.insert(products).values(productData).returning();
  console.log(`Created ${createdProducts.length} products`);

  // Initialize supply chain steps
  const supplyChainData: InsertSupplyChainStep[] = [
    {
      stepNumber: 1,
      title: "Indigenous Partnership",
      description: "Ethical sourcing through respectful partnerships with local communities",
      imageUrl: "https://images.unsplash.com/photo-1532618793091-ec5fe9635fbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Our partnerships with indigenous communities are built on respect, fair compensation, and mutual benefit. We work directly with traditional knowledge keepers to ensure authentic, sustainable harvesting practices.",
      location: "Local Communities Worldwide",
      certifications: ["Fair Trade", "Indigenous Partnership Certified"] as string[]
    },
    {
      stepNumber: 2,
      title: "Traditional Harvesting",
      description: "Sustainable collection using time-tested methods",
      imageUrl: "https://images.unsplash.com/photo-1512511708753-3150cd2ec8ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Harvesting is done at optimal times using traditional methods that have been refined over generations. This ensures maximum potency while preserving the ecosystem.",
      location: "Source Regions",
      certifications: ["Organic", "Sustainably Harvested"]
    },
    {
      stepNumber: 3,
      title: "Scientific Processing",
      description: "German precision meets botanical wisdom",
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Our German facility combines traditional knowledge with cutting-edge extraction technology. Fraunhofer Institute validation ensures the highest quality standards.",
      location: "Bavaria, Germany",
      certifications: ["GMP Certified", "Fraunhofer Validated", "ISO 9001"]
    },
    {
      stepNumber: 4,
      title: "Quality Assurance",
      description: "Rigorous testing and certification",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Every batch undergoes comprehensive testing for purity, potency, and safety. Third-party laboratories verify our quality claims.",
      location: "Certified Laboratories",
      certifications: ["Third-party Tested", "Certificate of Analysis"]
    }
  ];

  await db.insert(supplyChainSteps).values(supplyChainData);
  console.log("Created supply chain steps");

  // Initialize impact metrics
  await db.insert(impactMetrics).values([{
    schoolsBuilt: 15,
    familiesSupported: 2847,
    hectaresProtected: 12000,
    amountReinvested: "1250000.00",
    researchPapers: 127,
    clinicalTrials: 23,
    patents: 8
  }]);

  // Initialize community projects
  const communityProjectsData: InsertCommunityProject[] = [
    {
      name: "Kerala Clean Water Initiative",
      description: "Providing clean water access to farming communities in Kerala through well construction and water purification systems.",
      location: "Kerala, India",
      community: "Turmeric Farming Cooperatives",
      category: "infrastructure",
      status: "active",
      progress: 75,
      fundingGoal: "50000.00",
      currentFunding: "37500.00",
      startDate: new Date("2024-01-15"),
      targetCompletionDate: new Date("2024-12-31"),
      beneficiaries: 250
    },
    {
      name: "Siberian Forest Conservation",
      description: "Protecting and restoring Chaga mushroom habitats through sustainable forestry practices and community education.",
      location: "Siberia, Russia",
      community: "Indigenous Siberian Communities",
      category: "environment",
      status: "active",
      progress: 60,
      fundingGoal: "75000.00",
      currentFunding: "45000.00",
      startDate: new Date("2024-03-01"),
      targetCompletionDate: new Date("2025-02-28"),
      beneficiaries: 150
    }
  ];

  const createdProjects = await db.insert(communityProjects).values(communityProjectsData).returning();
  
  // Initialize learning modules
  const learningModulesData: InsertLearningModule[] = [
    {
      title: "Introduction to Adaptogenic Herbs",
      description: "Learn the fundamentals of adaptogenic plants and their health benefits",
      plantMaterial: "Ashwagandha",
      difficulty: "beginner",
      estimatedTime: 15,
      xpReward: 100,
      content: {
        sections: [
          {
            title: "What are Adaptogens?",
            type: "text" as const,
            content: "Adaptogens are natural substances that help your body adapt to stress and promote balance..."
          },
          {
            title: "Traditional Use Video",
            type: "video" as const,
            content: "Traditional preparation and uses of Ashwagandha by indigenous healers"
          },
          {
            title: "Knowledge Check",
            type: "quiz" as const,
            content: "Basic quiz about adaptogenic properties"
          }
        ]
      },
      prerequisites: [] as string[],
      isActive: true
    },
    {
      title: "Chaga: The King of Mushrooms",
      description: "Deep dive into Chaga mushroom benefits, preparation, and traditional uses",
      plantMaterial: "Chaga Mushroom",
      difficulty: "intermediate",
      estimatedTime: 25,
      xpReward: 150,
      content: {
        sections: [
          {
            title: "Chaga Biology and Ecology",
            type: "text" as const,
            content: "Understanding the unique parasitic relationship of Chaga with birch trees..."
          },
          {
            title: "Traditional Preparation Methods",
            type: "interactive" as const,
            content: "Interactive guide to traditional Chaga preparation methods"
          }
        ]
      },
      prerequisites: [] as string[],
      isActive: true
    }
  ];

  await db.insert(learningModules).values(learningModulesData);

  // Initialize badges
  const badgesData: InsertBadge[] = [
    {
      name: "First Purchase",
      description: "Made your first purchase from RÜTZ",
      iconUrl: "/badges/first-purchase.svg",
      category: "purchase",
      requirement: {
        type: "purchase_count",
        value: 1,
        criteria: null
      },
      rarity: "common",
      xpReward: 50,
      loyaltyPointsReward: 100
    },
    {
      name: "Learning Explorer",
      description: "Completed your first learning module",
      iconUrl: "/badges/learning-explorer.svg",
      category: "learning",
      requirement: {
        type: "modules_completed",
        value: 1,
        criteria: null
      },
      rarity: "common",
      xpReward: 75,
      loyaltyPointsReward: 50
    },
    {
      name: "Botanical Scholar",
      description: "Completed 5 learning modules",
      iconUrl: "/badges/botanical-scholar.svg",
      category: "learning",
      requirement: {
        type: "modules_completed",
        value: 5,
        criteria: null
      },
      rarity: "rare",
      xpReward: 200,
      loyaltyPointsReward: 250
    },
    {
      name: "Community Champion",
      description: "Contributed significantly to community impact",
      iconUrl: "/badges/community-champion.svg",
      category: "community",
      requirement: {
        type: "impact_value",
        value: 1000,
        criteria: null
      },
      rarity: "epic",
      xpReward: 500,
      loyaltyPointsReward: 1000
    }
  ];

  await db.insert(badges).values(badgesData);

  // Initialize journey stages
  const journeyStagesData = [
    {
      name: "Explorer",
      description: "Beginning your botanical journey",
      order: 1,
      requirements: {},
      rewards: {
        xp: 0,
        loyaltyPoints: 0
      },
      iconUrl: "/journey/explorer.svg",
      colorScheme: "green-100",
      isActive: true
    },
    {
      name: "Seeker",
      description: "Actively learning and exploring",
      order: 2,
      requirements: {
        minPurchases: 1,
        minLearningProgress: 25
      },
      rewards: {
        xp: 100,
        loyaltyPoints: 200,
        discount: 5
      },
      iconUrl: "/journey/seeker.svg",
      colorScheme: "green-200",
      isActive: true
    },
    {
      name: "Advocate",
      description: "Deep knowledge and community engagement",
      order: 3,
      requirements: {
        minPurchases: 3,
        minLearningProgress: 75,
        minLoyaltyPoints: 1000
      },
      rewards: {
        xp: 300,
        loyaltyPoints: 500,
        discount: 10
      },
      iconUrl: "/journey/advocate.svg",
      colorScheme: "green-300",
      isActive: true
    },
    {
      name: "Guardian",
      description: "Botanical wisdom keeper and community leader",
      order: 4,
      requirements: {
        minPurchases: 10,
        minLearningProgress: 100,
        minLoyaltyPoints: 5000
      },
      rewards: {
        xp: 1000,
        loyaltyPoints: 2000,
        discount: 20
      },
      iconUrl: "/journey/guardian.svg",
      colorScheme: "green-500",
      isActive: true
    }
  ];

  await db.insert(journeyStages).values(journeyStagesData);

  // Initialize inventory for created products
  const inventoryData: InsertInventory[] = createdProducts.map(product => ({
    productId: product.id,
    currentStock: Math.floor(Math.random() * 500) + 100, // 100-600 stock
    reservedStock: 0,
    lowStockThreshold: 20,
    reorderPoint: 50,
    maxStock: 1000
  }));

  await db.insert(inventory).values(inventoryData);

  console.log("Database initialization complete!");
}