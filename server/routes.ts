import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
