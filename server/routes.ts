import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertUserSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API with filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { sector, plantMaterial, productType } = req.query;
      const products = await storage.getProducts();
      
      let filteredProducts = products;
      
      if (sector) {
        filteredProducts = filteredProducts.filter(p => p.sector === sector);
      }
      
      if (plantMaterial) {
        filteredProducts = filteredProducts.filter(p => p.plantMaterial === plantMaterial);
      }
      
      if (productType) {
        filteredProducts = filteredProducts.filter(p => p.productType === productType);
      }
      
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get unique values for filtering
  app.get("/api/products/filters", async (req, res) => {
    try {
      const products = await storage.getProducts();
      
      const sectors = Array.from(new Set(products.map(p => p.sector)));
      const plantMaterials = Array.from(new Set(products.map(p => p.plantMaterial)));
      const productTypes = Array.from(new Set(products.map(p => p.productType)));
      
      res.json({
        sectors: sectors.sort(),
        plantMaterials: plantMaterials.sort(),
        productTypes: productTypes.sort()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filters" });
    }
  });

  // Get products grouped by plant material
  app.get("/api/products/by-plant/:plantMaterial", async (req, res) => {
    try {
      const { plantMaterial } = req.params;
      const products = await storage.getProducts();
      
      const plantProducts = products.filter(p => p.plantMaterial === plantMaterial);
      
      // Group by sector
      const groupedBySector = plantProducts.reduce((acc, product) => {
        if (!acc[product.sector]) {
          acc[product.sector] = [];
        }
        acc[product.sector].push(product);
        return acc;
      }, {} as Record<string, typeof products>);
      
      res.json({
        plantMaterial,
        totalProducts: plantProducts.length,
        sectors: groupedBySector
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Supply Chain API
  app.get("/api/supply-chain", async (req, res) => {
    try {
      const steps = await storage.getSupplyChainSteps();
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply chain steps" });
    }
  });

  app.get("/api/supply-chain/:id", async (req, res) => {
    try {
      const step = await storage.getSupplyChainStep(req.params.id);
      if (!step) {
        return res.status(404).json({ message: "Supply chain step not found" });
      }
      res.json(step);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply chain step" });
    }
  });

  // Impact Metrics API
  app.get("/api/impact", async (req, res) => {
    try {
      const metrics = await storage.getImpactMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch impact metrics" });
    }
  });

  // Community Impact Tracking Routes
  app.get("/api/community-projects", async (req, res) => {
    try {
      const projects = await storage.getCommunityProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community projects" });
    }
  });

  app.get("/api/community-projects/:id", async (req, res) => {
    try {
      const project = await storage.getCommunityProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get("/api/live-updates", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const updates = await storage.getLiveImpactUpdates(limit);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live updates" });
    }
  });

  app.get("/api/impact-milestones", async (req, res) => {
    try {
      const projectId = req.query.projectId as string;
      const milestones = await storage.getImpactMilestones(projectId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const item = await storage.addToCart(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const item = await storage.updateCartItem(req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Personalized Recommendations API
  app.post("/api/recommendations", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const preferences = req.body;
      
      const recommendations = await storage.generateRecommendations(sessionId, preferences);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.get("/api/recommendations", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const recommendations = await storage.getRecommendations(sessionId);
      
      if (!recommendations) {
        return res.status(404).json({ message: "No recommendations found" });
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get("/api/user-preferences", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const preferences = await storage.getUserPreferences(sessionId);
      
      if (!preferences) {
        return res.status(404).json({ message: "No preferences found" });
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  // =================== USER ACCOUNT MANAGEMENT ===================

  // Get user profile with progress and badges
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserWithProgress(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.put("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get user orders
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getUserOrders(userId);
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get user badges
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const { userId } = req.params;
      const badges = await storage.getUserBadges(userId);
      
      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Get user learning progress
  app.get("/api/users/:userId/learning", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserLearningProgress(userId);
      
      res.json(progress);
    } catch (error) {
      console.error("Error fetching learning progress:", error);
      res.status(500).json({ message: "Failed to fetch learning progress" });
    }
  });

  // Get user journey progress
  app.get("/api/users/:userId/journey", async (req, res) => {
    try {
      const { userId } = req.params;
      const journey = await storage.getUserJourneyProgress(userId);
      
      res.json(journey);
    } catch (error) {
      console.error("Error fetching journey progress:", error);
      res.status(500).json({ message: "Failed to fetch journey progress" });
    }
  });

  // Create new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // =================== ORDER MANAGEMENT ===================

  // Get order details
  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrderWithItems(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Update order status
  app.put("/api/orders/:orderId/status", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // =================== LEARNING & GAMIFICATION ===================

  // Get all learning modules
  app.get("/api/learning/modules", async (req, res) => {
    try {
      const modules = await storage.getLearningModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching learning modules:", error);
      res.status(500).json({ message: "Failed to fetch learning modules" });
    }
  });

  // Get all badges
  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Update learning progress
  app.put("/api/users/:userId/learning/:moduleId", async (req, res) => {
    try {
      const { userId, moduleId } = req.params;
      const { progress, status, xpEarned } = req.body;
      
      const updatedProgress = await storage.updateLearningProgress(userId, moduleId, {
        progress,
        status,
        xpEarned: xpEarned || 0
      });
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating learning progress:", error);
      res.status(500).json({ message: "Failed to update learning progress" });
    }
  });

  // Award badge to user
  app.post("/api/users/:userId/badges/:badgeId", async (req, res) => {
    try {
      const { userId, badgeId } = req.params;
      
      const userBadge = await storage.awardBadge(userId, badgeId);
      
      res.status(201).json(userBadge);
    } catch (error) {
      console.error("Error awarding badge:", error);
      res.status(500).json({ message: "Failed to award badge" });
    }
  });

  // Check if user can advance journey stage
  app.get("/api/users/:userId/journey/can-advance", async (req, res) => {
    try {
      const { userId } = req.params;
      const canAdvance = await storage.canAdvanceJourneyStage(userId);
      
      res.json(canAdvance);
    } catch (error) {
      console.error("Error checking journey advancement:", error);
      res.status(500).json({ message: "Failed to check journey advancement" });
    }
  });

  // Advance user journey stage
  app.post("/api/users/:userId/journey/advance", async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await storage.advanceJourneyStage(userId);
      
      res.json(result);
    } catch (error) {
      console.error("Error advancing journey stage:", error);
      res.status(500).json({ message: "Failed to advance journey stage" });
    }
  });

  // =================== INVENTORY MANAGEMENT ===================

  // Get inventory status for products
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Update inventory for product
  app.put("/api/inventory/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const { currentStock, reservedStock } = req.body;
      
      const updatedInventory = await storage.updateInventory(productId, {
        currentStock,
        reservedStock
      });
      
      res.json(updatedInventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // =================== GLOBAL INDIGENOUS PLANTS ===================

  // Get all global indigenous plants
  app.get("/api/global-indigenous-plants", async (req, res) => {
    try {
      const plants = await storage.getGlobalIndigenousPlants();
      res.json(plants);
    } catch (error) {
      console.error("Error fetching global indigenous plants:", error);
      res.status(500).json({ message: "Failed to fetch global indigenous plants" });
    }
  });

  // Get a specific global indigenous plant
  app.get("/api/global-indigenous-plants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plant = await storage.getGlobalIndigenousPlant(id);
      
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      res.json(plant);
    } catch (error) {
      console.error("Error fetching global indigenous plant:", error);
      res.status(500).json({ message: "Failed to fetch global indigenous plant" });
    }
  });

  // Get plants by region
  app.get("/api/global-indigenous-plants/region/:region", async (req, res) => {
    try {
      const { region } = req.params;
      const plants = await storage.getPlantsByRegion(region);
      res.json(plants);
    } catch (error) {
      console.error("Error fetching plants by region:", error);
      res.status(500).json({ message: "Failed to fetch plants by region" });
    }
  });

  // Get plants by indigenous tribe
  app.get("/api/global-indigenous-plants/tribe/:tribe", async (req, res) => {
    try {
      const { tribe } = req.params;
      const plants = await storage.getPlantsByTribe(tribe);
      res.json(plants);
    } catch (error) {
      console.error("Error fetching plants by tribe:", error);
      res.status(500).json({ message: "Failed to fetch plants by tribe" });
    }
  });

  // Search plants with filters
  app.post("/api/global-indigenous-plants/search", async (req, res) => {
    try {
      const filters = req.body;
      const plants = await storage.searchPlants(filters);
      res.json(plants);
    } catch (error) {
      console.error("Error searching plants:", error);
      res.status(500).json({ message: "Failed to search plants" });
    }
  });

  // TEMPORARY: Populate global indigenous plants data (remove after initial setup)
  app.post("/api/populate-global-plants", async (req, res) => {
    try {
      // Check if plants already exist
      const existingPlants = await storage.getGlobalIndigenousPlants();
      if (existingPlants.length > 0) {
        return res.json({ message: "Global indigenous plants already populated", count: existingPlants.length });
      }

      // Use the same data from initializeDatabase.ts
      const globalPlantsData = [
        {
          plantName: "Chaga",
          scientificName: "Inonotus obliquus",
          region: "North America",
          countryOfOrigin: "Canada, Alaska",
          indigenousTribesOrGroup: "Cree, Ojibwe, Inuit",
          traditionalUses: "Immune support, digestive health, tea preparation for winter wellness",
          popularProductForm: "Extract powder, tincture, tea",
          associatedCeremony: "Winter health ceremonies",
          veterinaryUse: "Traditional animal health support",
          sustainabilityNotes: "Wild-harvested with sustainable methods ensuring tree survival",
          researchStatus: "Extensively studied for β-glucans and immune support"
        },
        {
          plantName: "Labrador Tea",
          scientificName: "Rhododendron groenlandicum",
          region: "North America",
          countryOfOrigin: "Canada, Alaska",
          indigenousTribesOrGroup: "Inuit, Cree, Dene",
          traditionalUses: "Respiratory wellness, digestive support, ceremonial beverage",
          popularProductForm: "Dried leaves, tea blend",
          associatedCeremony: "Seasonal transition rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Bog-harvested with careful regeneration practices",
          researchStatus: "Traditional knowledge documented, antioxidant properties studied"
        },
        {
          plantName: "Wild Rose Hips",
          scientificName: "Rosa acicularis",
          region: "North America",
          countryOfOrigin: "Canada, Northern USA",
          indigenousTribesOrGroup: "Plains Cree, Blackfoot, Métis",
          traditionalUses: "Vitamin C source, digestive health, winter nutrition",
          popularProductForm: "Dried fruit, powder, syrup",
          associatedCeremony: null,
          veterinaryUse: "Traditional animal nutrition supplement",
          sustainabilityNotes: "Wild-harvested following traditional timing and methods",
          researchStatus: "High vitamin C content confirmed, nutritional profile documented"
        },
        {
          plantName: "Dragon's Blood",
          scientificName: "Croton lechleri",
          region: "South America",
          countryOfOrigin: "Peru, Ecuador, Colombia",
          indigenousTribesOrGroup: "Shipibo, Ashuar, Achuar",
          traditionalUses: "Wound healing, digestive support, skin protection",
          popularProductForm: "Latex resin, extract, topical preparations",
          associatedCeremony: "Healing rituals",
          veterinaryUse: "Traditional animal wound treatment",
          sustainabilityNotes: "Sustainable tapping methods that don't harm trees",
          researchStatus: "Proven wound healing properties, clinical studies on bioactive compounds"
        },
        {
          plantName: "Cat's Claw",
          scientificName: "Uncaria tomentosa",
          region: "South America",
          countryOfOrigin: "Peru, Brazil, Ecuador",
          indigenousTribesOrGroup: "Asháninka, Shipibo, Matsés",
          traditionalUses: "Immune support, joint health, digestive wellness",
          popularProductForm: "Bark extract, capsules, tea",
          associatedCeremony: "Healing ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Sustainable bark harvesting without killing vines",
          researchStatus: "Extensive research on immune-modulating alkaloids"
        },
        {
          plantName: "Cacao",
          scientificName: "Theobroma cacao",
          region: "South America",
          countryOfOrigin: "Ecuador, Peru, Colombia",
          indigenousTribesOrGroup: "Maya, Aztec, Quechua",
          traditionalUses: "Ceremonial beverage, heart health, mood enhancement",
          popularProductForm: "Raw beans, powder, ceremonial paste",
          associatedCeremony: "Cacao ceremonies, heart-opening rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Agroforestry cultivation preserving rainforest ecosystems",
          researchStatus: "Cardiovascular benefits well-documented, flavonoid research extensive"
        },
        {
          plantName: "Kangaroo Vine",
          scientificName: "Cissus antarctica",
          region: "Australia",
          countryOfOrigin: "Australia",
          indigenousTribesOrGroup: "Aboriginal Australians (various tribes)",
          traditionalUses: "Joint health, wound healing, digestive support",
          popularProductForm: "Leaf extract, powder, topical preparations",
          associatedCeremony: null,
          veterinaryUse: "Traditional animal joint care",
          sustainabilityNotes: "Cultivated and wild-harvested with Aboriginal guidance",
          researchStatus: "Joint health benefits studied, traditional knowledge preserved"
        },
        {
          plantName: "Kakadu Plum",
          scientificName: "Terminalia ferdinandiana",
          region: "Australia",
          countryOfOrigin: "Northern Australia",
          indigenousTribesOrGroup: "Yolŋu, Larrakia, Tiwi",
          traditionalUses: "Vitamin C source, immune support, skin health",
          popularProductForm: "Fruit powder, extract, vitamin supplements",
          associatedCeremony: "Seasonal harvesting ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Community-managed harvesting with traditional owners",
          researchStatus: "Highest natural vitamin C content documented"
        },
        {
          plantName: "Kawakawa",
          scientificName: "Piper excelsum",
          region: "New Zealand",
          countryOfOrigin: "New Zealand",
          indigenousTribesOrGroup: "Māori",
          traditionalUses: "Digestive health, respiratory support, skin conditions",
          popularProductForm: "Leaf tea, extract, topical balms",
          associatedCeremony: "Healing rituals, traditional medicine",
          veterinaryUse: null,
          sustainabilityNotes: "Māori-managed cultivation and harvesting",
          researchStatus: "Anti-inflammatory properties studied, traditional knowledge documented"
        },
        {
          plantName: "Mānuka",
          scientificName: "Leptospermum scoparium",
          region: "New Zealand",
          countryOfOrigin: "New Zealand, Southeast Australia",
          indigenousTribesOrGroup: "Māori",
          traditionalUses: "Wound healing, digestive support, respiratory health",
          popularProductForm: "Honey, leaf extract, essential oil",
          associatedCeremony: "Traditional healing ceremonies",
          veterinaryUse: "Animal wound care",
          sustainabilityNotes: "Sustainable beekeeping and leaf harvesting practices",
          researchStatus: "Antibacterial properties extensively researched, medical applications proven"
        },
        {
          plantName: "African Potato",
          scientificName: "Hypoxis hemerocallidea",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Zulu, Xhosa, Sotho",
          traditionalUses: "Immune support, prostate health, general wellness",
          popularProductForm: "Root extract, capsules, powder",
          associatedCeremony: "Traditional healing rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Cultivation programs to reduce wild harvesting pressure",
          researchStatus: "Immune-modulating compounds identified, clinical studies ongoing"
        },
        {
          plantName: "Kanna",
          scientificName: "Sceletium tortuosum",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoikhoi, San",
          traditionalUses: "Mood enhancement, stress relief, social ceremonies",
          popularProductForm: "Dried plant, extract, tea",
          associatedCeremony: "Social and spiritual ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Controlled cultivation to preserve wild populations",
          researchStatus: "Mood-enhancing alkaloids studied, traditional use patterns documented"
        },
        {
          plantName: "Buchu",
          scientificName: "Agathosma betulina",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoikhoi, San",
          traditionalUses: "Urinary tract health, digestive support, respiratory wellness",
          popularProductForm: "Leaf extract, tea, essential oil",
          associatedCeremony: "Traditional healing ceremonies",
          veterinaryUse: "Traditional animal health applications",
          sustainabilityNotes: "Sustainable wild harvesting and cultivation initiatives",
          researchStatus: "Antimicrobial properties documented, traditional uses validated"
        }
      ];

      const plants = await storage.createGlobalIndigenousPlants(globalPlantsData);
      res.json({ message: "Global indigenous plants populated successfully", count: plants.length });
    } catch (error) {
      console.error("Error populating global indigenous plants:", error);
      res.status(500).json({ message: "Failed to populate global indigenous plants" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
