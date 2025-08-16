import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, QrCode, Leaf, Award, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/lib/cartStore";

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  origin: string;
  category: string;
  sector: string;
  plantMaterial: string;
  productType: string;
  rating: string;
  reviewCount: number;
  imageUrl: string;
  qrCode: string;
  scientificName: string;
  extractionMethod: string;
  bioactiveCompounds: string[];
  certifications: string[];
  sustainabilityStory: string;
  communityImpact: string;
  researchPapers: { title: string; url: string; year: number }[];
  inStock: boolean;
}

const productCategories = [
  { key: "extract-powders", label: "Extract Powders", icon: "🧪" },
  { key: "capsules", label: "Capsules", icon: "💊" },
  { key: "herbal-teas", label: "Herbal Teas", icon: "🍵" },
  { key: "latte-mixes", label: "Latte Mixes", icon: "☕" },
  { key: "skincare", label: "Skincare", icon: "✨" },
];

const sectors = [
  { name: "Nutraceuticals", count: 8, color: "bg-emerald-500" },
  { name: "Functional Foods", count: 6, color: "bg-amber-500" },
  { name: "Cosmetics", count: 4, color: "bg-purple-500" },
  { name: "Biomedical", count: 3, color: "bg-blue-500" },
  { name: "Traditional Medicine", count: 5, color: "bg-orange-500" },
  { name: "Wellness", count: 2, color: "bg-pink-500" },
];

export default function ChagaPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<"grid" | "detailed">("grid");
  const addToCart = useCartStore((state) => state.addItem);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter only Chaga-related products
  const chagaProducts = products.filter(product => 
    product.plantMaterial?.toLowerCase().includes("chaga") || 
    product.name?.toLowerCase().includes("chaga")
  );

  const filteredProducts = selectedCategory === "all" 
    ? chagaProducts 
    : chagaProducts.filter(product => {
        const categoryMap: { [key: string]: string[] } = {
          "extract-powders": ["Extract Powders"],
          "capsules": ["Capsules"],
          "herbal-teas": ["Herbal Teas"],
          "latte-mixes": ["Latte Mixes"],
          "skincare": ["Skincare"],
        };
        return categoryMap[selectedCategory]?.includes(product.category);
      });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-sage to-forest opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="text-4xl font-bold text-white">
                R<span className="text-botanical-gold">Ü</span>TZ
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Chaga
              <span className="block text-3xl md:text-4xl font-light text-cream mt-2">
                Inonotus obliquus
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cream max-w-3xl mx-auto leading-relaxed">
              From the pristine Canadian Boreal Forests to your wellness journey
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-botanical-gold">{chagaProducts.length}</div>
                <div className="text-cream">Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-botanical-gold">{sectors.length}</div>
                <div className="text-cream">Sectors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-botanical-gold">28+</div>
                <div className="text-cream">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-botanical-gold">100%</div>
                <div className="text-cream">Wild Harvested</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Sectors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Application Sectors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete product ecosystem from raw material to diverse end applications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 ${sector.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="font-semibold text-forest mb-2">{sector.name}</h3>
                <p className="text-sm text-gray-600">{sector.count} products</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Filter */}
      <section className="py-8 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setSelectedCategory("all")}
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="px-6 py-3 rounded-full font-semibold"
            >
              All Products
            </Button>
            {productCategories.map((category) => (
              <Button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                variant={selectedCategory === category.key ? "default" : "outline"}
                className="px-6 py-3 rounded-full font-semibold"
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-forest">
              Chaga Product Collection ({filteredProducts.length})
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedView("grid")}
                variant={selectedView === "grid" ? "default" : "outline"}
                size="sm"
              >
                Grid
              </Button>
              <Button
                onClick={() => setSelectedView("detailed")}
                variant={selectedView === "detailed" ? "default" : "outline"}
                size="sm"
              >
                Detailed
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className={selectedView === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-8"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {selectedView === "grid" ? (
                    <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className="relative overflow-hidden">
                        <Link href={`/products/${product.id}`}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        
                        <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-lg">
                          <QrCode className="w-4 h-4 text-forest" />
                        </div>
                        
                        <Badge className="absolute bottom-4 left-4 bg-sage text-white">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm font-bold text-forest">
                            R<span className="text-sage">Ü</span>TZ
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.qrCode}
                          </Badge>
                        </div>
                        
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-xl font-semibold text-forest mb-2 hover:text-sage transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-forest">€{product.price}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.certifications?.slice(0, 2).map((cert, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-forest text-white py-2 rounded-lg hover:bg-sage transition-colors"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                        
                        <CardContent className="md:w-2/3 p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-sm font-bold text-forest">
                              R<span className="text-sage">Ü</span>TZ
                            </div>
                            <div className="flex gap-2">
                              <Badge className="bg-sage text-white">{product.category}</Badge>
                              <Badge variant="outline">{product.qrCode}</Badge>
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-forest mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-4">{product.shortDescription}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <p className="text-sm text-gray-500">Origin</p>
                              <p className="font-semibold text-forest">{product.origin}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Sector</p>
                              <p className="font-semibold text-forest">{product.sector}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Extraction Method</p>
                              <p className="font-semibold text-forest">{product.extractionMethod}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Rating</p>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-semibold text-forest">
                                  {product.rating} ({product.reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {product.certifications?.map((cert, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-forest">€{product.price}</span>
                            <div className="flex gap-3">
                              <Link href={`/products/${product.id}`}>
                                <Button variant="outline" className="px-6">
                                  View Details
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleAddToCart(product)}
                                className="bg-forest text-white px-6 hover:bg-sage transition-colors"
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try selecting a different category or view all products.</p>
            </div>
          )}
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 bg-gradient-to-r from-sage to-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Users className="w-16 h-16 mx-auto mb-6 text-botanical-gold" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Supporting Indigenous Communities
            </h2>
            <p className="text-xl text-cream max-w-3xl mx-auto leading-relaxed">
              Every Chaga product purchase directly supports the Cheslatta Carrier Nation 
              through ethical partnerships, fair trade practices, and traditional knowledge preservation programs.
            </p>
            <div className="mt-8">
              <Link href="/about">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-forest px-8 py-3">
                  Learn More About Our Impact
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}