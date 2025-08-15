import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Leaf, FlaskConical, Globe } from "lucide-react";
import { Link } from "wouter";

const PlantExplorerFeature: React.FC = () => {
  const featuredPlants = [
    {
      name: "Chaga Mushroom",
      scientificName: "Inonotus obliquus",
      icon: "🍄",
      origin: "Canadian Boreal Forests",
      products: 28,
      sectors: ["Nutraceuticals", "Functional Foods", "Cosmetics", "Biomedical", "Industrial", "R&D"],
      highlight: "Complete product ecosystem from raw material to 28+ end applications"
    },
    {
      name: "Turmeric",
      scientificName: "Curcuma longa",
      icon: "🌿", 
      origin: "Kerala, India",
      products: 15,
      sectors: ["Nutraceuticals", "Functional Foods", "Cosmetics"],
      highlight: "Traditional Ayurvedic wisdom meets modern extraction"
    },
    {
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      icon: "🌱",
      origin: "Rajasthan, India", 
      products: 12,
      sectors: ["Nutraceuticals", "Cosmetics", "R&D"],
      highlight: "Adaptogenic powerhouse with indigenous knowledge keepers"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-rutz-forest/5 via-white to-rutz-gold/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Leaf className="h-8 w-8 text-rutz-forest" />
              <span className="absolute -top-1 -right-1 text-green-600 text-sm">🔬</span>
            </div>
            <h2 className="text-4xl font-bold text-rutz-forest">Plant Explorer</h2>
          </div>
          <p className="text-xl text-rutz-sage max-w-4xl mx-auto leading-relaxed">
            Discover how single plant raw materials transform into complete product ecosystems. 
            From indigenous harvesting to scientific applications across multiple industries.
          </p>
        </motion.div>

        {/* Featured Plants */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {featuredPlants.map((plant, index) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-rutz-gold/20 hover:border-rutz-gold/40 transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-2">{plant.icon}</div>
                  <CardTitle className="text-rutz-forest text-xl">{plant.name}</CardTitle>
                  <CardDescription className="text-rutz-sage italic text-sm">
                    {plant.scientificName}
                  </CardDescription>
                  <Badge variant="outline" className="border-rutz-gold text-rutz-forest font-medium w-fit mx-auto">
                    {plant.origin}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <FlaskConical className="h-4 w-4 text-rutz-gold" />
                        <span className="text-lg font-bold text-rutz-forest">{plant.products}</span>
                        <span className="text-sm text-rutz-sage">products</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-rutz-gold" />
                        <span className="text-lg font-bold text-rutz-forest">{plant.sectors.length}</span>
                        <span className="text-sm text-rutz-sage">sectors</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-rutz-sage leading-relaxed">
                      {plant.highlight}
                    </p>
                    
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-medium text-rutz-forest">Application Sectors</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {plant.sectors.slice(0, 4).map((sector) => (
                          <Badge key={sector} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                        {plant.sectors.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{plant.sectors.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="border-rutz-gold/30 bg-gradient-to-r from-rutz-gold/10 to-rutz-forest/10 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-rutz-forest">
                    Explore the Complete Plant-to-Product Journey
                  </h3>
                  <p className="text-rutz-sage leading-relaxed max-w-2xl mx-auto">
                    Discover how traditional botanical knowledge combines with modern science 
                    to create comprehensive product ecosystems. Filter by plant material, 
                    application sector, or product type to explore the full possibilities.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/plant-explorer">
                    <Button 
                      size="lg"
                      className="bg-rutz-forest text-white hover:bg-rutz-sage transition-colors px-8"
                      data-testid="explore-plants-button"
                    >
                      <Leaf className="mr-2 h-5 w-5" />
                      Explore Plant Ecosystem
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2 text-sm text-rutz-sage">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-rutz-gold rounded-full"></span>
                      <span>28+ Chaga products</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-rutz-forest rounded-full"></span>
                      <span>6 application sectors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>Full lifecycle view</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PlantExplorerFeature;