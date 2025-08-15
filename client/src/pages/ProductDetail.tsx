import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Star, ShoppingCart, QrCode, Leaf, Beaker, Heart, MapPin } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="font-brand bg-natural min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="font-brand bg-natural min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
                <QrCode className="w-6 h-6 text-forest" />
              </div>
              <div className="absolute bottom-4 left-4 bg-sage text-white px-3 py-1 rounded-full text-sm font-semibold">
                Fair Sourced
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div>
                <h1 className="text-3xl font-bold text-forest mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{product.origin}</span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-gray-600">({product.reviewCount} reviews)</span>
                  </div>
                  <Badge variant="outline" className="bg-cream border-sage">
                    QR: {product.qrCode}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-forest">€{product.price}</span>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="bg-forest text-white hover:bg-sage px-8 py-3"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-forest mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-forest mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications?.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="bg-cream text-forest">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Information Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Scientific Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <Beaker className="w-5 h-5 mr-2" />
                  Scientific Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold text-sm text-gray-600">Scientific Name:</span>
                  <p className="text-forest font-medium">{product.scientificName}</p>
                </div>
                <div>
                  <span className="font-semibold text-sm text-gray-600">Extraction Method:</span>
                  <p className="text-gray-700">{product.extractionMethod}</p>
                </div>
                <div>
                  <span className="font-semibold text-sm text-gray-600">Bioactive Compounds:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.bioactiveCompounds?.map((compound, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {compound}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <Leaf className="w-5 h-5 mr-2" />
                  Sustainability Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.sustainabilityStory}
                </p>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <Heart className="w-5 h-5 mr-2" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.communityImpact}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Research Papers */}
          {product.researchPapers && product.researchPapers.length > 0 && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">Scientific Research</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.researchPapers.map((paper, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                        <div>
                          <h4 className="font-semibold text-forest">{paper.title}</h4>
                          <p className="text-sm text-gray-600">Published: {paper.year}</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-forest border-sage">
                          View Paper
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
      <CartSidebar />
    </div>
  );
}
