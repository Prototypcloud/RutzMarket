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
      name: "Labrador Tea Premium Blend",
      description: "Wild-crafted Labrador tea leaves from pristine northern Canadian bogs, traditionally used by Inuit and First Nations for respiratory wellness. German-processed standardized herbal tea blend.",
      shortDescription: "Traditional respiratory wellness tea from boreal regions",
      price: "24.99",
      origin: "Boreal / Subarctic Canada",
      category: "Herbal Teas",
      sector: "Herbal teas, antioxidant botanical extracts",
      plantMaterial: "Labrador tea",
      productType: "Standardized herbal tea blend",
      rating: "4.8",
      reviewCount: 127,
      imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-LAB-001",
      scientificName: "Rhododendron groenlandicum",
      extractionMethod: "Traditional drying + standardized preparation",
      bioactiveCompounds: ["Ledol", "Grayanotoxins", "Essential oils", "Flavonoids"] as string[],
      certifications: ["Wild-Harvested", "Traditional Processing", "Sustainably Sourced"] as string[],
      sustainabilityStory: "Sustainably wild-harvested from certified boreal regions using traditional methods that preserve ecosystem integrity.",
      communityImpact: "Supporting Inuit and Cree communities in northern Canada with fair trade practices and traditional knowledge preservation programs.",
      researchPapers: [
        { title: "Antioxidant Properties of Labrador Tea Flavonoids", url: "#", year: 2023 },
        { title: "Traditional Uses and Modern Applications of Rhododendron groenlandicum", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Devil's Club Root Extract",
      description: "Sacred Northwest Coast medicine processed with German precision. Traditional blood sugar support and immune system enhancement. Sustainably harvested from BC coastal forests.",
      shortDescription: "Traditional blood sugar and immune support from Northwest Coast",
      price: "79.99",
      origin: "Northwest Coast / Interior BC–Yukon",
      category: "Extract Powders",
      sector: "Antidiabetic supplements, antimicrobial extracts",
      plantMaterial: "Devil's club",
      productType: "Standardized root extract powder",
      rating: "4.7",
      reviewCount: 93,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-DEV-002",
      scientificName: "Oplopanax horridus",
      extractionMethod: "Hydroalcoholic extraction + standardization",
      bioactiveCompounds: ["Polyynes (falcarindiol)", "Lignans", "Saponins"] as string[],
      certifications: ["Sustainably Sourced", "Lab Verified", "Indigenous Partnership"] as string[],
      sustainabilityStory: "Sustainably harvested with traditional protocols that ensure plant regeneration and forest ecosystem preservation.",
      communityImpact: "Revenue sharing with Northwest Coast First Nations and supporting traditional medicine preservation programs.",
      researchPapers: [
        { title: "Antimycobacterial Properties of Oplopanax horridus Extracts", url: "#", year: 2023 },
        { title: "Blood Sugar Support: Traditional and Modern Applications", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Bearberry Leaf Capsules",
      description: "Premium uva-ursi leaf extract standardized for arbutin content. Traditional urinary health support from across Canada, processed with German precision for optimal bioavailability.",
      shortDescription: "Traditional urinary tract health support capsules",
      price: "39.99",
      origin: "Across Canada (dry sites)",
      category: "Capsules",
      sector: "Urinary tract health capsules",
      plantMaterial: "Bearberry (kinnikinnick)",
      productType: "Standardized leaf extract capsules",
      rating: "4.6",
      reviewCount: 84,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-BEA-003",
      scientificName: "Arctostaphylos uva-ursi",
      extractionMethod: "Standardized extraction (20% arbutin)",
      bioactiveCompounds: ["Arbutin", "Hydroquinone", "Tannins", "Flavonoids"] as string[],
      certifications: ["Wild-Harvested", "Standardized", "Third-Party Tested"] as string[],
      sustainabilityStory: "Sustainably harvested from dry sites across Canada using traditional methods that preserve root systems and habitat.",
      communityImpact: "Supporting indigenous harvesting cooperatives and traditional knowledge preservation programs.",
      researchPapers: [
        { title: "Urinary Antiseptic Properties of Arctostaphylos uva-ursi", url: "#", year: 2023 },
        { title: "Traditional Indigenous Uses and Modern Applications", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Sweetgrass Aromatherapy Oil",
      description: "Sacred sweetgrass essential oil extracted with reverence for traditional protocols. Aromatic and ceremonial applications from Prairie, Boreal and Eastern woodlands.",
      shortDescription: "Sacred aromatherapy oil for ceremonial and therapeutic use",
      price: "54.99",
      origin: "Prairie / Boreal / Eastern woodlands",
      category: "Essential Oils",
      sector: "Aromatherapy oils, ceremonial incense",
      plantMaterial: "Sweetgrass",
      productType: "Pure essential oil",
      rating: "4.9",
      reviewCount: 67,
      imageUrl: "https://images.unsplash.com/photo-1595572882861-ee47ac7ae1a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-SWE-004",
      scientificName: "Hierochloe odorata",
      extractionMethod: "Steam distillation + ceremonial protocols",
      bioactiveCompounds: ["Coumarin", "Phytol", "Essential oil compounds"] as string[],
      certifications: ["Ceremonially Harvested", "Pure Essential Oil", "Ethically Sourced"] as string[],
      sustainabilityStory: "Ceremonially harvested with traditional protocols that honor the plant spirit and ensure sustainable regeneration.",
      communityImpact: "Harvested with ceremony by Prairie First Nations and supports traditional ceremony preservation programs.",
      researchPapers: [
        { title: "Aromatic Properties and Traditional Uses of Sweetgrass", url: "#", year: 2023 },
        { title: "Natural Insect Repellent Properties of Hierochloe odorata", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Eastern White Cedar Tea",
      description: "Vitamin C-rich needle tea blend, traditionally used to prevent scurvy. Hand-harvested from eastern Canadian forests and processed to preserve natural vitamin content.",
      shortDescription: "Traditional vitamin C-rich needle tea for immune support",
      price: "19.99",
      origin: "Eastern Canada",
      category: "Herbal Teas",
      sector: "Herbal teas, vitamin C-rich beverage powders",
      plantMaterial: "Eastern white cedar",
      productType: "Traditional herbal tea blend",
      rating: "4.4",
      reviewCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-CED-005",
      scientificName: "Thuja occidentalis",
      extractionMethod: "Traditional drying + preparation",
      bioactiveCompounds: ["Vitamin C", "Thujone", "Essential oils"] as string[],
      certifications: ["Wild-Harvested", "Traditional Processing", "Sustainably Sourced"] as string[],
      sustainabilityStory: "Hand-harvested from eastern Canadian forests using traditional methods that ensure tree health and ecosystem preservation.",
      communityImpact: "Harvested by Haudenosaunee and Algonquin communities with revenue sharing and traditional knowledge programs.",
      researchPapers: [
        { title: "Vitamin C Content and Bioavailability in Thuja occidentalis", url: "#", year: 2023 },
        { title: "Traditional Scurvy Prevention: Indigenous Wisdom", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Wild Rose Hip Powder",
      description: "Hand-harvested rose hips from Canadian wilderness areas, freeze-dried to preserve vitamin C and natural compounds. Traditional superfood for immune support.",
      shortDescription: "Vitamin C-rich superfood powder from Canadian wilderness",
      price: "34.99",
      origin: "Prairie and Boreal Regions",
      category: "Superfood Powders",
      sector: "Antioxidant powders, functional food blends",
      plantMaterial: "Wild Rose",
      productType: "Freeze-dried fruit powder",
      rating: "4.9",
      reviewCount: 203,
      imageUrl: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-ROS-006",
      scientificName: "Rosa acicularis",
      extractionMethod: "Freeze-drying + milling",
      bioactiveCompounds: ["Vitamin C", "Flavonoids", "Carotenoids", "Pectin"] as string[],
      certifications: ["Wild-Harvested", "Organic", "Freeze-Dried"] as string[],
      sustainabilityStory: "Sustainably harvested from pristine Canadian wilderness areas using methods that support plant regeneration.",
      communityImpact: "Harvested by local indigenous youth programs with proceeds supporting education and cultural preservation.",
      researchPapers: [
        { title: "Antioxidant Properties of Canadian Wild Rose Hips", url: "#", year: 2023 },
        { title: "Traditional Food Source: Nutritional Analysis", url: "#", year: 2024 }
      ],
      inStock: true
    },
    {
      name: "Cloudberry Antioxidant Powder",
      description: "Rare Arctic cloudberries freeze-dried to concentrate natural antioxidants. Traditional Inuit superfruit from pristine tundra regions, processed with German technology.",
      shortDescription: "Rare Arctic superfruit with concentrated antioxidants",
      price: "69.99",
      origin: "Arctic / Subarctic",
      category: "Superfood Powders",
      sector: "Antioxidant powders, functional food blends",
      plantMaterial: "Cloudberry",
      productType: "Freeze-dried fruit powder",
      rating: "4.8",
      reviewCount: 89,
      imageUrl: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      qrCode: "RUTZ-CLD-007",
      scientificName: "Rubus chamaemorus",
      extractionMethod: "Freeze-drying + concentration",
      bioactiveCompounds: ["Vitamin C", "Ellagic acid", "Anthocyanins", "Omega fatty acids"] as string[],
      certifications: ["Wild-Harvested", "Arctic Pure", "Freeze-Dried"] as string[],
      sustainabilityStory: "Harvested from pristine Arctic tundra using traditional Inuit methods that respect the delicate ecosystem.",
      communityImpact: "Harvested by Inuit communities in Nunavut with revenue sharing and support for traditional lifestyle preservation.",
      researchPapers: [
        { title: "Antioxidant Properties of Arctic Cloudberries", url: "#", year: 2023 },
        { title: "Traditional Arctic Foods: Nutritional Powerhouses", url: "#", year: 2024 }
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
      name: "Northern Ontario Clean Water Initiative",
      description: "Providing clean water access to indigenous communities in Northern Ontario through well construction and water purification systems.",
      location: "Northern Ontario, Canada",
      community: "Cree and Ojibwe First Nations",
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
      name: "Boreal Forest Conservation",
      description: "Protecting and restoring Canadian boreal forest habitats through sustainable forestry practices and indigenous community education.",
      location: "Boreal Canada",
      community: "Indigenous Canadian Communities",
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
      title: "Introduction to Traditional Canadian Plant Medicine",
      description: "Learn the fundamentals of Indigenous Canadian plant medicines and their traditional uses",
      plantMaterial: "Labrador tea",
      difficulty: "beginner",
      estimatedTime: 15,
      xpReward: 100,
      content: {
        sections: [
          {
            title: "What is Traditional Plant Medicine?",
            type: "text" as const,
            content: "Traditional plant medicine encompasses the knowledge and practices of Indigenous peoples in using plants for healing..."
          },
          {
            title: "Traditional Use Video",
            type: "video" as const,
            content: "Traditional preparation and uses of Labrador tea by Inuit and Cree healers"
          },
          {
            title: "Knowledge Check",
            type: "quiz" as const,
            content: "Basic quiz about traditional plant medicine principles"
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