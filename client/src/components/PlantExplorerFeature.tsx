import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "wouter";
import { Leaf, FlaskConical, Package, Sparkles, ArrowRight, TreePine } from "lucide-react";

const PlantExplorerFeature: React.FC = () => {
  const plantMaterials = [
    {
      name: "Chaga Mushroom",
      icon: "🍄",
      productsCount: 6,
      sectors: ["Supplements", "Beverages", "Cosmetics", "Biomedical"]
    },
    {
      name: "Turmeric",
      icon: "🌿", 
      productsCount: 4,
      sectors: ["Supplements", "Functional Foods", "Cosmetics"]
    },
    {
      name: "Ashwagandha",
      icon: "🌱",
      productsCount: 3,
      sectors: ["Supplements", "Beverages", "Wellness"]
    }
  ];

  return (
    <section className="bg-gradient-to-br from-rutz-cream via-white to-rutz-sage/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="h-8 w-8 text-rutz-forest" />
            <h2 className="text-4xl font-bold text-rutz-forest">Plant-Based Product Ecosystem</h2>
          </div>
          <p className="text-xl text-rutz-sage max-w-3xl mx-auto">
            Discover how single plant materials transform into comprehensive product lines across multiple industries.
            From traditional supplements to cutting-edge biomedical applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plantMaterials.map((plant, index) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-rutz-gold/20 hover:border-rutz-gold/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {plant.icon}
                  </div>
                  <CardTitle className="text-rutz-forest">{plant.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="border-rutz-gold text-rutz-forest">
                      {plant.productsCount} Products
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {plant.sectors.map((sector) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-rutz-sage">
                      Full product lifecycle from raw botanical material to end applications
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="inline-block border-rutz-gold/30 bg-gradient-to-r from-rutz-gold/10 to-rutz-forest/5">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-8 text-sm text-rutz-sage">
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="h-5 w-5 text-rutz-forest" />
                    <span>Supplements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-rutz-forest" />
                    <span>Beverages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-rutz-forest" />
                    <span>Cosmetics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-rutz-forest" />
                    <span>Biomedical</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-rutz-forest">
                    Explore Complete Plant Product Cycles
                  </h3>
                  <p className="text-rutz-sage max-w-2xl mx-auto">
                    See how we transform raw botanical materials into 28+ product variations across 6 different sectors.
                    Filter by plant source, application sector, or product type.
                  </p>
                </div>

                <Link to="/plant-explorer">
                  <Button 
                    size="lg" 
                    className="bg-rutz-forest hover:bg-rutz-forest/90 text-white font-semibold"
                    data-testid="button-explore-plant-system"
                  >
                    <Leaf className="h-5 w-5 mr-2" />
                    Explore Plant System
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PlantExplorerFeature;