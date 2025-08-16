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
      
      const updatedProgress = await storage.updateLearningProgress(userId, moduleId, progress, status, xpEarned || 0);
      
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
      const result = await storage.advanceJourneyStage(userId, "next");
      
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
      const inventory = await storage.getInventory("all");
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
      // Clear existing plants first for fresh data
      await storage.deleteAllGlobalIndigenousPlants();

      // Complete data from CSV upload
      const globalPlantsData = [
        {
          plantName: "Echinacea",
          scientificName: "Echinacea purpurea",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Plains Tribes (Lakota, Dakota, Omaha)",
          traditionalUses: "Immune boosting, treating colds, flu, and infections",
          popularProductForm: "Nutraceuticals, liquid tonics",
          timeframe: "Traditional knowledge passed down through generations",
          associatedCeremony: "Healing ceremonies, especially for immune system support",
          veterinaryUse: "Yes - Immune support, respiratory infections in horses and dogs",
          sustainabilityNotes: "Wild-crafted with sustainable harvesting practices",
          researchStatus: "Extensively studied for immune-modulating properties"
        },
        {
          plantName: "Yarrow",
          scientificName: "Achillea millefolium",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Numerous Tribes (Blackfoot, Cherokee, Iroquois)",
          traditionalUses: "Anti-inflammatory, pain relief, treating wounds, fevers, digestive issues",
          popularProductForm: "Essential oils, herbal teas",
          timeframe: "Traditional knowledge passed down through generations",
          associatedCeremony: "Used in sweat lodge ceremonies for purification and healing",
          veterinaryUse: "Yes - Wound care, anti-inflammatory for various animals",
          sustainabilityNotes: "Abundant wild herb, sustainably wildcrafted",
          researchStatus: "Traditional wound healing properties validated by research"
        },
        {
          plantName: "Sweetgrass",
          scientificName: "Hierochloe odorata",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Plains Tribes (Lakota, Dakota, Blackfoot)",
          traditionalUses: "Used in purification rituals and to treat colds and sore throats",
          popularProductForm: "Essential oils, smudging sticks",
          associatedCeremony: "Smudging ceremonies for purification and to invite positive energy",
          veterinaryUse: null,
          sustainabilityNotes: "Wild-harvested with traditional protocols ensuring regeneration",
          researchStatus: "Sacred plant with documented aromatic compounds"
        },
        {
          plantName: "White Sage",
          scientificName: "Salvia apiana",
          region: "North America",
          countryOfOrigin: "United States (California)",
          indigenousTribesOrGroup: "Chumash, Cahuilla, Kumeyaay",
          traditionalUses: "Purification, treating respiratory issues",
          popularProductForm: "Smudging sticks, essential oils",
          associatedCeremony: "Smudging ceremonies for cleansing and protection",
          veterinaryUse: null,
          sustainabilityNotes: "Protected native plant, cultivated sustainably to preserve wild populations",
          researchStatus: "Antimicrobial and aromatic properties studied"
        },
        {
          plantName: "Willow Bark",
          scientificName: "Salix spp.",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Numerous Tribes (Cherokee, Ojibwe, Cree)",
          traditionalUses: "Pain reliever, reducing fevers, treating headaches",
          popularProductForm: "Nutraceuticals, herbal extracts",
          associatedCeremony: "Healing ceremonies, often associated with pain relief",
          veterinaryUse: "Yes - Pain relief in dogs and horses, anti-inflammatory",
          sustainabilityNotes: "Sustainably harvested bark without harming trees",
          researchStatus: "Source of salicin, precursor to aspirin - extensively researched"
        },
        {
          plantName: "Bearberry",
          scientificName: "Arctostaphylos uva-ursi",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cree, Anishinaabe, Blackfoot",
          traditionalUses: "Urinary tract issues, ceremonial smoking",
          popularProductForm: "Herbal teas, supplements",
          associatedCeremony: "Used in peace pipe ceremonies and traditional smoking mixtures",
          veterinaryUse: null,
          sustainabilityNotes: "Wild-harvested with traditional timing protocols",
          researchStatus: "Arbutin content studied for urinary tract health"
        },
        {
          plantName: "Goldenseal",
          scientificName: "Hydrastis Canadensis",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cherokee, Iroquois",
          traditionalUses: "Antiseptic, treating infections of the skin and eyes",
          popularProductForm: "Herbal extracts, supplements",
          associatedCeremony: "Healing ceremonies, especially for skin and eye conditions",
          veterinaryUse: "Yes - Antiseptic for wounds and skin infections in various animals",
          sustainabilityNotes: "Protected species, cultivated to reduce wild harvesting pressure",
          researchStatus: "Berberine content extensively studied for antimicrobial properties"
        },
        {
          plantName: "Juniper",
          scientificName: "Juniperus spp.",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Navajo, Ute, Hopi",
          traditionalUses: "Respiratory and urinary tract issues",
          popularProductForm: "Essential oils, supplements",
          associatedCeremony: "Used in purification rituals and to ward off evil spirits",
          veterinaryUse: "Yes - Urinary tract health, digestive aid for livestock",
          sustainabilityNotes: "Wild-harvested berries with sustainable collection practices",
          researchStatus: "Essential oil components studied for antimicrobial activity"
        },
        {
          plantName: "Cedar",
          scientificName: "Thuja spp.",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Haudenosaunee (Iroquois), Coast Salish, Cree",
          traditionalUses: "Treating fevers, coughs, and ceremonial use",
          popularProductForm: "Essential oils, smudging sticks",
          associatedCeremony: "Smudging and sweat lodge ceremonies for purification",
          veterinaryUse: null,
          sustainabilityNotes: "Sustainably harvested from managed forests",
          researchStatus: "Thujone compounds studied for antifungal properties"
        },
        {
          plantName: "Wild Cherry Bark",
          scientificName: "Prunus serotina",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cherokee, Delaware (Lenape), Iroquois",
          traditionalUses: "Coughs and respiratory issues",
          popularProductForm: "Herbal syrups, extracts",
          associatedCeremony: "Used in healing ceremonies for respiratory health",
          veterinaryUse: "Yes - Respiratory issues in dogs and horses",
          sustainabilityNotes: "Bark harvested sustainably without damaging trees",
          researchStatus: "Antitussive properties documented in traditional medicine studies"
        },
        {
          plantName: "Black Cohosh",
          scientificName: "Actaea racemosa",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cherokee, Iroquois, Algonquin",
          traditionalUses: "Women's health issues",
          popularProductForm: "Nutraceuticals, herbal supplements",
          associatedCeremony: "Used in women's healing ceremonies, especially related to fertility",
          veterinaryUse: null,
          sustainabilityNotes: "Wild populations protected, primarily cultivated for commercial use",
          researchStatus: "Extensively studied for menopausal symptoms and women's health"
        },
        {
          plantName: "American Ginseng",
          scientificName: "Panax quinquefolius",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Iroquois, Cherokee, Miami",
          traditionalUses: "Tonic, treating respiratory conditions",
          popularProductForm: "Nutraceuticals, herbal extracts",
          associatedCeremony: "Used in strength and vitality ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "CITES-protected species, cultivated under strict regulations",
          researchStatus: "Ginsenosides extensively researched for adaptogenic properties"
        },
        {
          plantName: "Devil's Club",
          scientificName: "Oplopanax horridus",
          region: "North America",
          countryOfOrigin: "United States (Pacific Northwest), Canada",
          indigenousTribesOrGroup: "Tlingit, Haida, Tsimshian",
          traditionalUses: "Arthritis, immune support",
          popularProductForm: "Herbal extracts, supplements",
          associatedCeremony: "Used in protective ceremonies and for spiritual strength",
          veterinaryUse: "Yes - Joint pain relief for dogs",
          sustainabilityNotes: "Sacred plant harvested with ceremonial protocols",
          researchStatus: "Traditional arthritis treatment with emerging scientific validation"
        },
        {
          plantName: "Mullein",
          scientificName: "Verbascum thapsus",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cherokee, Mohawk, Anishinaabe",
          traditionalUses: "Respiratory issues",
          popularProductForm: "Herbal teas, supplements",
          associatedCeremony: "Used in healing ceremonies, particularly for lung conditions",
          veterinaryUse: "Yes - Respiratory issues in dogs and horses",
          sustainabilityNotes: "Naturalized plant, abundantly available for sustainable harvest",
          researchStatus: "Expectorant and demulcent properties validated"
        },
        {
          plantName: "Sagebrush",
          scientificName: "Artemisia tridentata",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Navajo, Shoshone, Paiute",
          traditionalUses: "Treating colds, fevers, headaches, spiritual practices",
          popularProductForm: "Herbal teas, smudging sticks",
          associatedCeremony: "Smudging ceremonies for cleansing and protection",
          veterinaryUse: null,
          sustainabilityNotes: "Abundant desert plant, sustainably wild-harvested",
          researchStatus: "Antimicrobial compounds in essential oils studied"
        },
        {
          plantName: "Damiana",
          scientificName: "Turnera diffusa",
          region: "North America",
          countryOfOrigin: "United States (Southwest), Mexico",
          indigenousTribesOrGroup: "Apache, Seri, Tarahumara",
          traditionalUses: "Aphrodisiac, improving mood, treating respiratory ailments",
          popularProductForm: "Herbal teas, supplements",
          associatedCeremony: "Used in love and fertility ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Wild-harvested with sustainable collection practices",
          researchStatus: "Traditional aphrodisiac properties under scientific investigation"
        },
        {
          plantName: "Tobacco",
          scientificName: "Nicotiana spp.",
          region: "North America",
          countryOfOrigin: "United States, Mexico, Canada",
          indigenousTribesOrGroup: "Numerous Tribes (Lakota, Haudenosaunee, Cherokee)",
          traditionalUses: "Sacred plants used in ceremonies, prayers, offerings",
          popularProductForm: "Herbal smoking blends, ceremonial use",
          associatedCeremony: "Central to many Indigenous ceremonies, including prayer and offering",
          veterinaryUse: null,
          sustainabilityNotes: "Sacred plant cultivated with traditional protocols",
          researchStatus: "Sacred ceremonial use documented, nicotine compounds studied"
        },
        {
          plantName: "Cattail",
          scientificName: "Typha spp.",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Numerous Tribes (Cree, Ojibwe, Potawatomi)",
          traditionalUses: "Wound dressing, food source, medicinal purposes",
          popularProductForm: "Herbal teas, topical applications",
          associatedCeremony: "Used in emergency healing rituals, especially for wounds",
          veterinaryUse: null,
          sustainabilityNotes: "Wetland plant sustainably harvested with ecosystem considerations",
          researchStatus: "Wound healing and nutritional properties documented"
        },
        {
          plantName: "Wild Rose",
          scientificName: "Rosa spp.",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Cree, Blackfoot, Haida",
          traditionalUses: "Treating colds and flu as a tonic",
          popularProductForm: "Rosehip oil, herbal teas",
          associatedCeremony: "Used in love and protection ceremonies",
          veterinaryUse: "Yes - Skin and coat health for dogs",
          sustainabilityNotes: "Wild rosehips collected sustainably during appropriate seasons",
          researchStatus: "High vitamin C content and antioxidant properties well-documented"
        },
        {
          plantName: "Sarsaparilla",
          scientificName: "Smilax spp.",
          region: "North America",
          countryOfOrigin: "United States, Mexico",
          indigenousTribesOrGroup: "Cherokee, Nahua (Aztec), Maya",
          traditionalUses: "Skin conditions, blood purification, inflammatory conditions",
          popularProductForm: "Nutraceuticals, herbal teas",
          associatedCeremony: "Used in purification ceremonies and for physical vitality",
          veterinaryUse: "Yes - Blood purifier, skin conditions in dogs",
          sustainabilityNotes: "Root harvesting done sustainably to preserve plant populations",
          researchStatus: "Saponin compounds studied for anti-inflammatory properties"
        },
        {
          plantName: "Nettle",
          scientificName: "Urtica dioica",
          region: "North America",
          countryOfOrigin: "United States, Canada",
          indigenousTribesOrGroup: "Numerous Tribes (Cree, Iroquois, Cherokee)",
          traditionalUses: "Treating allergies, arthritis, general tonic",
          popularProductForm: "Nutraceuticals, herbal teas, extracts",
          associatedCeremony: "Used in cleansing ceremonies for the body and spirit",
          veterinaryUse: "Yes - Arthritis, allergies, and general tonic for horses and dogs",
          sustainabilityNotes: "Abundant wild plant, sustainably harvested year-round",
          researchStatus: "Anti-inflammatory and nutritional properties extensively studied"
        },
        {
          plantName: "Yucca",
          scientificName: "Yucca spp.",
          region: "North America",
          countryOfOrigin: "United States (Southwest), Mexico",
          indigenousTribesOrGroup: "Navajo, Pueblo, Hopi",
          traditionalUses: "Anti-inflammatory properties, skin conditions, joint pain",
          popularProductForm: "Nutraceuticals, herbal supplements",
          associatedCeremony: "Used in purification and protection ceremonies",
          veterinaryUse: "Yes - Joint health and digestive aid for horses",
          sustainabilityNotes: "Desert plant sustainably harvested with traditional methods",
          researchStatus: "Saponin content studied for joint health and anti-inflammatory effects"
        },
        {
          plantName: "Labrador Tea",
          scientificName: "Rhododendron groenlandicum",
          region: "North America",
          countryOfOrigin: "Canada, United States (Alaska)",
          indigenousTribesOrGroup: "Inuit, Cree, Inupiat",
          traditionalUses: "Treating colds, coughs, digestive issues",
          popularProductForm: "Herbal teas, extracts",
          associatedCeremony: "Used in healing ceremonies for digestive and respiratory health",
          veterinaryUse: null,
          sustainabilityNotes: "Bog plant harvested with traditional seasonal protocols",
          researchStatus: "Antioxidant properties and traditional respiratory benefits documented"
        },
        {
          plantName: "Ayahuasca",
          scientificName: "Banisteriopsis caapi",
          region: "South America",
          countryOfOrigin: "Peru, Brazil, Colombia, Ecuador",
          indigenousTribesOrGroup: "Various Amazonian Tribes (Shipibo, Ashaninka)",
          traditionalUses: "Spiritual ceremonies, treating psychological and physical ailments",
          popularProductForm: "Liquid tonics (under controlled use)",
          associatedCeremony: "Central to spiritual ceremonies, particularly for vision quests",
          veterinaryUse: null,
          sustainabilityNotes: "Sacred vine sustainably managed by indigenous communities",
          researchStatus: "Psychoactive compounds studied for therapeutic potential under controlled conditions"
        },
        {
          plantName: "Coca",
          scientificName: "Erythroxylum coca",
          region: "South America",
          countryOfOrigin: "Peru, Bolivia, Colombia",
          indigenousTribesOrGroup: "Quechua, Aymara, Inca",
          traditionalUses: "Alleviating altitude sickness, fatigue, hunger",
          popularProductForm: "Herbal teas, nutritional supplements",
          associatedCeremony: "Used in Andean rituals, particularly for offerings and energy",
          veterinaryUse: null,
          sustainabilityNotes: "Traditional cultivation in Andean communities with ancestral protocols",
          researchStatus: "High-altitude adaptation properties and nutritional content studied"
        },
        {
          plantName: "Chanca Piedra",
          scientificName: "Phyllanthus niruri",
          region: "South America",
          countryOfOrigin: "Brazil, Peru, Colombia",
          indigenousTribesOrGroup: "Indigenous groups in the Amazon Basin",
          traditionalUses: "Treating kidney stones, liver problems, digestive issues",
          popularProductForm: "Nutraceuticals, liquid extracts",
          associatedCeremony: "Used in healing ceremonies focused on liver and kidney health",
          veterinaryUse: null,
          sustainabilityNotes: "Wild rainforest herb sustainably collected by local communities",
          researchStatus: "Hepatoprotective and kidney stone prevention properties documented"
        },
        {
          plantName: "Cat's Claw",
          scientificName: "Uncaria tomentosa",
          region: "South America",
          countryOfOrigin: "Peru, Brazil, Colombia",
          indigenousTribesOrGroup: "Ashaninka, Shipibo, and other Amazonian Tribes",
          traditionalUses: "Inflammatory conditions, immune support",
          popularProductForm: "Nutraceuticals, herbal supplements",
          associatedCeremony: "Used in Amazonian healing rituals for immune support",
          veterinaryUse: null,
          sustainabilityNotes: "Bark harvested sustainably without harming vine growth",
          researchStatus: "Immune-modulating alkaloids extensively researched"
        },
        {
          plantName: "Jergón Sacha",
          scientificName: "Dracontium loretense",
          region: "South America",
          countryOfOrigin: "Peru, Ecuador",
          indigenousTribesOrGroup: "Indigenous groups in the Amazon Basin",
          traditionalUses: "Antidote for snakebites",
          popularProductForm: "Herbal extracts, topical applications",
          associatedCeremony: "Used in protective rituals, particularly against snake bites",
          veterinaryUse: null,
          sustainabilityNotes: "Rainforest plant collected with traditional protocols",
          researchStatus: "Traditional antivenom properties under scientific investigation"
        },
        {
          plantName: "Maca",
          scientificName: "Lepidium meyenii",
          region: "South America",
          countryOfOrigin: "Peru, Bolivia",
          indigenousTribesOrGroup: "Quechua, Inca, Aymara",
          traditionalUses: "Increasing energy, fertility, stamina",
          popularProductForm: "Nutraceuticals, powder form",
          associatedCeremony: "Used in fertility and vitality ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "High-altitude cultivation by Andean communities using traditional methods",
          researchStatus: "Adaptogenic and fertility-enhancing properties well-documented"
        },
        {
          plantName: "Guayusa",
          scientificName: "Ilex guayusa",
          region: "South America",
          countryOfOrigin: "Ecuador, Peru",
          indigenousTribesOrGroup: "Kichwa (Ecuadorian Amazon)",
          traditionalUses: "Stimulant, improving mental clarity",
          popularProductForm: "Herbal teas, liquid tonics",
          associatedCeremony: "Used in rituals for mental clarity and endurance",
          veterinaryUse: null,
          sustainabilityNotes: "Cultivated in agroforestry systems preserving rainforest ecosystem",
          researchStatus: "Caffeine and antioxidant content studied for cognitive benefits"
        },
        {
          plantName: "Sangre de Drago",
          scientificName: "Croton lechleri",
          region: "South America",
          countryOfOrigin: "Peru, Ecuador, Colombia",
          indigenousTribesOrGroup: "Various Amazonian Tribes",
          traditionalUses: "Wound healing, gastrointestinal problems",
          popularProductForm: "Liquid extracts, topical applications",
          associatedCeremony: "Used in Amazonian healing rituals for wound care",
          veterinaryUse: null,
          sustainabilityNotes: "Tree resin tapped sustainably without harming the tree",
          researchStatus: "Wound healing properties clinically validated"
        },
        {
          plantName: "Guarana",
          scientificName: "Paullinia cupana",
          region: "South America",
          countryOfOrigin: "Brazil",
          indigenousTribesOrGroup: "Sateré-Mawé (Brazil)",
          traditionalUses: "Stimulant, enhancing physical endurance",
          popularProductForm: "Nutraceuticals, energy drinks",
          associatedCeremony: "Used in energy-enhancing rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Seeds harvested sustainably by indigenous communities",
          researchStatus: "Natural caffeine content and cognitive enhancement properties studied"
        },
        {
          plantName: "Achiote",
          scientificName: "Bixa Orellana",
          region: "South America",
          countryOfOrigin: "Peru, Brazil, Colombia",
          indigenousTribesOrGroup: "Numerous Amazonian Tribes",
          traditionalUses: "Digestive issues, anti-inflammatory",
          popularProductForm: "Nutraceuticals, herbal teas",
          associatedCeremony: "Used in body painting and protective rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Seeds sustainably collected from cultivated trees",
          researchStatus: "Antioxidant and anti-inflammatory properties documented"
        },
        {
          plantName: "Lapacho",
          scientificName: "Tabebuia impetiginosa",
          region: "South America",
          countryOfOrigin: "Brazil, Paraguay, Argentina",
          indigenousTribesOrGroup: "Guarani (Brazil, Paraguay)",
          traditionalUses: "Treating infections, inflammatory diseases",
          popularProductForm: "Herbal teas, supplements",
          associatedCeremony: "Used in healing ceremonies for infections",
          veterinaryUse: null,
          sustainabilityNotes: "Inner bark harvested sustainably without killing trees",
          researchStatus: "Antimicrobial and anti-inflammatory compounds studied"
        },
        {
          plantName: "Camu Camu",
          scientificName: "Myrciaria dubia",
          region: "South America",
          countryOfOrigin: "Peru, Brazil",
          indigenousTribesOrGroup: "Indigenous groups in the Amazon Basin",
          traditionalUses: "High in vitamin C, boosting the immune system",
          popularProductForm: "Nutraceuticals, powder form",
          associatedCeremony: "Used in ceremonies for health and vitality",
          veterinaryUse: null,
          sustainabilityNotes: "Fruits sustainably harvested from wild Amazonian trees",
          researchStatus: "Highest natural vitamin C content scientifically documented"
        },
        {
          plantName: "Yohimbe",
          scientificName: "Pausinystalia yohimbe",
          region: "South America",
          countryOfOrigin: "Brazil",
          indigenousTribesOrGroup: "Various Indigenous Tribes in Brazil",
          traditionalUses: "Aphrodisiac, enhancing athletic performance",
          popularProductForm: "Nutraceuticals, supplements",
          associatedCeremony: "Used in rituals for strength and masculinity",
          veterinaryUse: null,
          sustainabilityNotes: "Bark harvested with sustainable forestry practices",
          researchStatus: "Yohimbine alkaloid studied for cardiovascular and performance effects"
        },
        {
          plantName: "Guava",
          scientificName: "Psidium guajava",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Cuba, Puerto Rico",
          indigenousTribesOrGroup: "Taíno, Arawak",
          traditionalUses: "Treating digestive problems, an antimicrobial agent",
          popularProductForm: "Herbal teas, juices",
          associatedCeremony: "Used in cleansing and protection ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Cultivated fruit trees managed with traditional agroforestry",
          researchStatus: "Antimicrobial and digestive health properties documented"
        },
        {
          plantName: "Soursop",
          scientificName: "Annona muricata",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Haiti, Dominican Republic",
          indigenousTribesOrGroup: "Taíno, Maroons",
          traditionalUses: "Treating infections, fevers, parasitic infections",
          popularProductForm: "Herbal teas, juices, supplements",
          associatedCeremony: "Used in healing ceremonies for fever and infection",
          veterinaryUse: null,
          sustainabilityNotes: "Cultivated trees with traditional Caribbean farming methods",
          researchStatus: "Antimicrobial and anti-parasitic compounds under investigation"
        },
        {
          plantName: "Cerasee",
          scientificName: "Momordica charantia",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Trinidad, Barbados",
          indigenousTribesOrGroup: "Taíno, Maroons",
          traditionalUses: "Treating digestive issues, diabetes, skin conditions",
          popularProductForm: "Herbal teas, supplements",
          associatedCeremony: "Used in cleansing and purification rituals",
          veterinaryUse: null,
          sustainabilityNotes: "Wild vine sustainably harvested with traditional protocols",
          researchStatus: "Anti-diabetic and digestive health properties scientifically validated"
        },
        {
          plantName: "Ginger",
          scientificName: "Zingiber officinale",
          region: "Caribbean",
          countryOfOrigin: "Jamaica",
          indigenousTribesOrGroup: "Maroons (Jamaica, Suriname)",
          traditionalUses: "Treating nausea, digestive issues, colds",
          popularProductForm: "Nutraceuticals, herbal teas, essential oils",
          associatedCeremony: "Used in protection and healing ceremonies",
          veterinaryUse: "Yes - Digestive aid and anti-nausea for dogs and horses",
          sustainabilityNotes: "Cultivated rhizome with sustainable agricultural practices",
          researchStatus: "Anti-nausea and digestive properties extensively documented"
        },
        {
          plantName: "Neem",
          scientificName: "Azadirachta indica",
          region: "Caribbean",
          countryOfOrigin: "Trinidad, Barbados",
          indigenousTribesOrGroup: "East Indian Communities (Caribbean)",
          traditionalUses: "Anti-inflammatory, antifungal skin conditions",
          popularProductForm: "Essential oils, herbal extracts",
          associatedCeremony: "Used in cleansing and protective rituals",
          veterinaryUse: "Yes - Skin treatment for various animals, insect repellent",
          sustainabilityNotes: "Cultivated trees with sustainable harvesting of leaves and bark",
          researchStatus: "Antimicrobial and anti-inflammatory properties extensively studied"
        },
        {
          plantName: "Lemongrass",
          scientificName: "Cymbopogon citratus",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Trinidad, Barbados",
          indigenousTribesOrGroup: "Taíno, Maroons",
          traditionalUses: "Treating digestive problems, fever reducer",
          popularProductForm: "Essential oils, herbal teas",
          associatedCeremony: "Used in purification and cleansing rituals",
          veterinaryUse: "Yes - Insect repellent for animals, digestive aid",
          sustainabilityNotes: "Cultivated grass sustainably harvested for leaves",
          researchStatus: "Essential oil components studied for antimicrobial and digestive effects"
        },
        {
          plantName: "Aloe Vera",
          scientificName: "Aloe barbadensis miller",
          region: "Caribbean",
          countryOfOrigin: "Barbados, Jamaica, Dominican Republic",
          indigenousTribesOrGroup: "Taíno, Garifuna",
          traditionalUses: "Skin healing, burns, digestive issues",
          popularProductForm: "Topical gels, juices",
          associatedCeremony: "Used in healing and protection ceremonies",
          veterinaryUse: "Yes - Skin healing and digestive aid for dogs and horses",
          sustainabilityNotes: "Cultivated succulent sustainably harvested for gel",
          researchStatus: "Wound healing and digestive properties well-documented"
        },
        {
          plantName: "Noní",
          scientificName: "Morinda citrifolia",
          region: "Caribbean",
          countryOfOrigin: "Puerto Rico, Jamaica, Dominican Republic",
          indigenousTribesOrGroup: "Taíno, Garifuna",
          traditionalUses: "Boosting the immune system, anti-inflammatory",
          popularProductForm: "Nutraceuticals, juices, supplements",
          associatedCeremony: "Used in immune-boosting and healing ceremonies",
          veterinaryUse: null,
          sustainabilityNotes: "Cultivated trees with traditional harvesting of ripe fruits",
          researchStatus: "Immune-modulating and antioxidant properties studied"
        },
        {
          plantName: "Bay Leaf",
          scientificName: "Laurus nobilis",
          region: "Caribbean",
          countryOfOrigin: "Puerto Rico, Jamaica",
          indigenousTribesOrGroup: "Taíno, Garifuna",
          traditionalUses: "Treating respiratory issues, digestive problems, diabetes",
          popularProductForm: "Essential oils, culinary uses",
          associatedCeremony: "Used in protection and purification ceremonies",
          veterinaryUse: "Yes - Digestive aid and respiratory aid for dogs and horses",
          sustainabilityNotes: "Cultivated trees with sustainable leaf harvesting",
          researchStatus: "Essential oil components studied for digestive and respiratory benefits"
        },
        {
          plantName: "Peppermint",
          scientificName: "Mentha piperita",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Trinidad",
          indigenousTribesOrGroup: "Taíno, Maroons",
          traditionalUses: "Treating digestive issues, respiratory problems",
          popularProductForm: "Essential oils, herbal teas",
          associatedCeremony: "Used in ceremonies for clarity and protection",
          veterinaryUse: "Yes - Digestive aid, anti-nausea for dogs and horses",
          sustainabilityNotes: "Cultivated herb sustainably harvested for leaves",
          researchStatus: "Menthol compounds extensively studied for digestive and respiratory effects"
        },
        {
          plantName: "Passionflower",
          scientificName: "Passiflora incarnata",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Puerto Rico",
          indigenousTribesOrGroup: "Taíno, Garifuna",
          traditionalUses: "Sedative, treating anxiety and insomnia",
          popularProductForm: "Herbal teas, liquid extracts",
          associatedCeremony: "Used in calming and sleep-inducing ceremonies",
          veterinaryUse: "Yes - Calming and anxiety relief for dogs",
          sustainabilityNotes: "Wild vine sustainably harvested for aerial parts",
          researchStatus: "Anxiolytic and sedative properties clinically validated"
        },
        {
          plantName: "Coconut",
          scientificName: "Cocos nucifera",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, Haiti, Dominican Republic",
          indigenousTribesOrGroup: "Taíno, Garifuna",
          traditionalUses: "Hydration, skin care, antimicrobial",
          popularProductForm: "Coconut oil, water, skincare products",
          associatedCeremony: "Used in protection and healing ceremonies",
          veterinaryUse: "Yes - Skincare, digestive aid for dogs and livestock",
          sustainabilityNotes: "Cultivated palms with traditional coconut farming practices",
          researchStatus: "Medium-chain fatty acids and antimicrobial properties documented"
        },
        {
          plantName: "Arrowroot",
          scientificName: "Maranta arundinacea",
          region: "Caribbean",
          countryOfOrigin: "Jamaica, St. Vincent, Dominican Republic",
          indigenousTribesOrGroup: "Kalinago (Carib)",
          traditionalUses: "Treating digestive issues, baby food",
          popularProductForm: "Powder form, nutritional supplements",
          associatedCeremony: "Used in nourishment and protection rituals",
          veterinaryUse: "Yes - Digestive aid for pets and livestock",
          sustainabilityNotes: "Cultivated rhizome with traditional Caribbean farming methods",
          researchStatus: "Digestive health and nutritional properties documented"
        },
        {
          plantName: "Vetiver",
          scientificName: "Chrysopogon zizanioides",
          region: "Caribbean",
          countryOfOrigin: "Haiti",
          indigenousTribesOrGroup: "Haitian Vodou Communities",
          traditionalUses: "Calming effects, treating anxiety insomnia, cooling the body",
          popularProductForm: "Essential oils, perfumery",
          associatedCeremony: "Used in calming and grounding ceremonies",
          veterinaryUse: "Yes - Calming and anxiety relief for dogs",
          sustainabilityNotes: "Cultivated grass with sustainable root harvesting",
          researchStatus: "Essential oil studied for anxiolytic and cooling properties"
        },
        {
          plantName: "Moringa",
          scientificName: "Moringa oleifera",
          region: "Caribbean",
          countryOfOrigin: "Haiti, Jamaica",
          indigenousTribesOrGroup: "Taíno, Maroons, Haitian Communities",
          traditionalUses: "High nutritional value, immune support, treating inflammation and malnutrition",
          popularProductForm: "Nutraceuticals, powder form, supplements",
          associatedCeremony: "Used in nourishment and health rituals",
          veterinaryUse: "Yes - Nutritional supplement for pets and livestock",
          sustainabilityNotes: "Fast-growing tree cultivated with sustainable harvesting practices",
          researchStatus: "Exceptional nutritional profile and anti-inflammatory properties documented"
        },
        {
          plantName: "Tea Tree",
          scientificName: "Melaleuca alternifolia",
          region: "Australia",
          countryOfOrigin: "Australia",
          indigenousTribesOrGroup: "Aboriginal Australians (Bundjalung)",
          traditionalUses: "Antiseptic, antifungal, treating skin conditions",
          popularProductForm: "Essential oils, topical applications",
          associatedCeremony: "Used in cleansing and protection ceremonies",
          veterinaryUse: "Yes - Antiseptic and skin treatment for dogs and livestock",
          sustainabilityNotes: "Wild-harvested and cultivated with Aboriginal traditional knowledge",
          researchStatus: "Antiseptic and antifungal properties extensively validated"
        },
        {
          plantName: "Eucalyptus",
          scientificName: "Eucalyptus spp.",
          region: "Australia",
          countryOfOrigin: "Australia",
          indigenousTribesOrGroup: "Aboriginal Australians (Noongar, Koori)",
          traditionalUses: "Respiratory issues, antiseptic, insect repellent",
          popularProductForm: "Essential oils, inhalants",
          associatedCeremony: "Used in cleansing and respiratory healing rituals",
          veterinaryUse: "Yes - Respiratory aid, repellent for dogs and horses",
          sustainabilityNotes: "Sustainably harvested leaves from managed Australian forests",
          researchStatus: "Eucalyptol and respiratory benefits extensively researched"
        },
        {
          plantName: "Kakadu Plum",
          scientificName: "Terminalia ferdinandiana",
          region: "Australia",
          countryOfOrigin: "Australia",
          indigenousTribesOrGroup: "Aboriginal Australians (Mirarr, Gagudju)",
          traditionalUses: "High in vitamin C, antioxidant, immune support",
          popularProductForm: "Nutraceuticals, powder form",
          associatedCeremony: "Used in health and vitality ceremonies",
          veterinaryUse: "Yes - Nutritional supplement for pets and livestock",
          sustainabilityNotes: "Wild fruits harvested with Aboriginal traditional knowledge",
          researchStatus: "Highest recorded vitamin C content in natural foods documented"
        },
        {
          plantName: "Manuka",
          scientificName: "Leptospermum scoparium",
          region: "New Zealand",
          countryOfOrigin: "New Zealand",
          indigenousTribesOrGroup: "Māori (Aotearoa/New Zealand)",
          traditionalUses: "Antibacterial, wound healing, treating skin conditions",
          popularProductForm: "Honey, topical applications",
          associatedCeremony: "Used in healing and protection ceremonies",
          veterinaryUse: "Yes - Wound healing and skin care for dogs and horses",
          sustainabilityNotes: "Sustainable beekeeping and traditional Māori management",
          researchStatus: "Unique antibacterial properties of honey extensively validated"
        },
        {
          plantName: "Kawakawa",
          scientificName: "Piper excelsum",
          region: "New Zealand",
          countryOfOrigin: "New Zealand",
          indigenousTribesOrGroup: "Māori (Aotearoa/New Zealand)",
          traditionalUses: "Digestive issues, pain relief, anti-inflammatory",
          popularProductForm: "Herbal teas, topical applications",
          associatedCeremony: "Used in healing and cleansing ceremonies",
          veterinaryUse: "Yes - Digestive aid and anti-inflammatory for dogs",
          sustainabilityNotes: "Traditional Māori cultivation and sustainable leaf harvesting",
          researchStatus: "Anti-inflammatory compounds and traditional uses documented"
        },
        {
          plantName: "Rooibos",
          scientificName: "Aspalathus linearis",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoisan (South Africa)",
          traditionalUses: "Antioxidant, digestive health, skin health",
          popularProductForm: "Herbal teas, extracts",
          associatedCeremony: "Used in cleansing and healing ceremonies",
          veterinaryUse: "Yes - Antioxidant and digestive health for pets",
          sustainabilityNotes: "Cultivated with traditional Khoisan knowledge in South African fynbos",
          researchStatus: "Antioxidant properties and caffeine-free benefits documented"
        },
        {
          plantName: "Baobab",
          scientificName: "Adansonia digitata",
          region: "Africa",
          countryOfOrigin: "Sub-Saharan Africa",
          indigenousTribesOrGroup: "Various African Tribes (Mali, Sudan, Zimbabwe)",
          traditionalUses: "High in vitamin C, antioxidant, immune support",
          popularProductForm: "Nutraceuticals, powder form",
          associatedCeremony: "Used in fertility and vitality ceremonies",
          veterinaryUse: "Yes - Nutritional supplement for pets and livestock",
          sustainabilityNotes: "Fruit sustainably harvested from ancient trees with community management",
          researchStatus: "Exceptional nutritional profile and antioxidant content documented"
        },
        {
          plantName: "Devil's Claw",
          scientificName: "Harpagophytum procumbens",
          region: "Africa",
          countryOfOrigin: "Southern Africa",
          indigenousTribesOrGroup: "San (Bushmen), Bantu (Southern Africa)",
          traditionalUses: "Anti-inflammatory, pain relief, treating arthritis",
          popularProductForm: "Nutraceuticals, herbal supplements",
          associatedCeremony: "Used in healing ceremonies for joint pain",
          veterinaryUse: "Yes - Joint pain relief and anti-inflammatory for dogs and horses",
          sustainabilityNotes: "Wild tubers sustainably harvested with traditional protocols",
          researchStatus: "Anti-inflammatory and arthritis treatment properties clinically validated"
        },
        {
          plantName: "Aloe Ferox",
          scientificName: "Aloe ferox",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Xhosa, Zulu (South Africa)",
          traditionalUses: "Digestive health, skin healing, laxative",
          popularProductForm: "Topical gels, extracts",
          associatedCeremony: "Used in healing and cleansing ceremonies",
          veterinaryUse: "Yes - Digestive health and skin healing for dogs and horses",
          sustainabilityNotes: "Wild plants sustainably harvested with traditional South African methods",
          researchStatus: "Digestive and wound healing properties documented"
        },
        {
          plantName: "Buchu",
          scientificName: "Agathosma betulina",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoisan (South Africa)",
          traditionalUses: "Urinary tract health, anti-inflammatory, digestive aid",
          popularProductForm: "Herbal teas, extracts",
          associatedCeremony: "Used in cleansing and healing ceremonies",
          veterinaryUse: "Yes - Urinary tract health and digestive aid for pets",
          sustainabilityNotes: "Wild plants cultivated with traditional Khoisan knowledge",
          researchStatus: "Urinary tract health and antimicrobial properties documented"
        },
        {
          plantName: "Hoodia",
          scientificName: "Hoodia gordonii",
          region: "Africa",
          countryOfOrigin: "Southern Africa",
          indigenousTribesOrGroup: "San (Bushmen), Nama (Southern Africa)",
          traditionalUses: "Appetite-suppressant, weight management",
          popularProductForm: "Nutraceuticals, supplements",
          associatedCeremony: "Used in rituals for appetite control and endurance",
          veterinaryUse: null,
          sustainabilityNotes: "Protected succulent sustainably managed with San community involvement",
          researchStatus: "Appetite suppressant compounds studied with mixed clinical results"
        },
        {
          plantName: "Honeybush",
          scientificName: "Cyclopia spp.",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoisan (South Africa)",
          traditionalUses: "Antioxidant, digestive health, treating respiratory issues",
          popularProductForm: "Herbal teas, extracts",
          associatedCeremony: "Used in healing and cleansing ceremonies",
          veterinaryUse: "Yes - Antioxidant and digestive health for pets",
          sustainabilityNotes: "Wild plants sustainably harvested with traditional knowledge",
          researchStatus: "Antioxidant and digestive properties documented"
        },
        {
          plantName: "Marula",
          scientificName: "Sclerocarya birrea",
          region: "Africa",
          countryOfOrigin: "Southern Africa",
          indigenousTribesOrGroup: "Zulu, San (Bushmen), Himba (Southern Africa)",
          traditionalUses: "Antioxidant, skin care, anti-inflammatory",
          popularProductForm: "Oils, extracts",
          associatedCeremony: "Used in fertility and healing ceremonies",
          veterinaryUse: "Yes - Skin and coat care for dogs and horses",
          sustainabilityNotes: "Fruit and oil sustainably harvested with community management",
          researchStatus: "Antioxidant and skin care properties documented"
        },
        {
          plantName: "Pelargonium",
          scientificName: "Pelargonium sidoides",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Xhosa, Zulu (South Africa)",
          traditionalUses: "Respiratory health, immune support, treating colds and flu",
          popularProductForm: "Herbal extracts, supplements",
          associatedCeremony: "Used in healing ceremonies for respiratory health",
          veterinaryUse: "Yes - Respiratory health and immune support for dogs and horses",
          sustainabilityNotes: "Cultivated plants with traditional harvesting methods",
          researchStatus: "Respiratory health benefits clinically validated"
        },
        {
          plantName: "African Ginger",
          scientificName: "Siphonochilus aethiopicus",
          region: "Africa",
          countryOfOrigin: "Southern Africa",
          indigenousTribesOrGroup: "Zulu, Xhosa, Bantu (Southern Africa)",
          traditionalUses: "Anti-inflammatory, digestive health, treating colds",
          popularProductForm: "Nutraceuticals, herbal teas, extracts",
          associatedCeremony: "Used in healing and protection ceremonies",
          veterinaryUse: "Yes - Digestive aid and anti-inflammatory for dogs and horses",
          sustainabilityNotes: "Wild rhizome sustainably harvested with traditional protocols",
          researchStatus: "Anti-inflammatory and digestive properties documented"
        },
        {
          plantName: "Sceletium",
          scientificName: "Sceletium tortuosum",
          region: "Africa",
          countryOfOrigin: "South Africa",
          indigenousTribesOrGroup: "Khoisan (South Africa)",
          traditionalUses: "Mood enhancer, anxiety relief, stress management",
          popularProductForm: "Nutraceuticals, herbal supplements",
          associatedCeremony: "Used in calming and mood-enhancing rituals",
          veterinaryUse: "Yes - Anxiety and stress relief for dogs",
          sustainabilityNotes: "Cultivated succulent with traditional Khoisan practices",
          researchStatus: "Mood-enhancing alkaloids studied for anxiolytic properties"
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
