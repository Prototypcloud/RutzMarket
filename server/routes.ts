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

  const httpServer = createServer(app);
  return httpServer;
}
