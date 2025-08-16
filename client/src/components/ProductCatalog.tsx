import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, QrCode, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productCategories } from "@/lib/data";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Logo } from "@/components/ui/logo";
import type { Product } from "@shared/schema";

interface ProductCatalogProps {
  showAllProducts: boolean;
  activeFilter?: string;
}

export default function ProductCatalog({ showAllProducts, activeFilter = "all" }: ProductCatalogProps) {
  const [filter, setFilter] = useState(activeFilter);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    return product.category === filter;
  });

  const displayProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAllProducts && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Premium Botanical Extracts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each extract tells a story of indigenous wisdom, scientific innovation, 
              and sustainable impact.
            </p>
          </motion.div>
        )}

        {!showAllProducts && (
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-cream rounded-lg p-1">
              {productCategories.map((category) => (
                <Button
                  key={category.key}
                  onClick={() => setFilter(category.key)}
                  variant={filter === category.key ? "default" : "ghost"}
                  className={`px-6 py-2 rounded-md font-semibold ${
                    filter === category.key
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-600 hover:text-forest"
                  }`}
                  data-testid={`filter-${category.key}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <motion.img
                        src={product.imageUrl.startsWith('/assets/') ? 
                          `/src${product.imageUrl}` :
                          product.imageUrl
                        }
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      />
                    </Link>
                    
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-lg">
                      <QrCode className="w-4 h-4 text-forest" />
                    </div>
                    
                    <Badge className="absolute bottom-4 left-4 bg-sage text-white px-2 py-1 rounded text-xs font-semibold">
                      Fair Sourced
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    {/* RÜTZ Logo */}
                    <div className="flex justify-between items-start mb-3">
                      <Logo size="sm" showText={false} className="text-sm" />
                    </div>
                    
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-xl font-semibold text-forest mb-2 cursor-pointer hover:text-sage transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3">{product.origin}</p>
                    <p className="text-gray-700 mb-4 text-sm line-clamp-3">
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
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-forest text-white py-2 rounded-lg hover:bg-sage transition-colors"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {!showAllProducts && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/products">
              <Button 
                size="lg"
                className="bg-sage text-white px-8 py-3 rounded-lg font-semibold hover:bg-forest transition-colors"
                data-testid="view-all-products"
              >
                View All Products
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
