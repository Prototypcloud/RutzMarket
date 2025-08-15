import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-forest to-sage text-white py-20 overflow-hidden">
      {/* Background pattern representing root & circuit motif */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><defs><pattern id='circuit' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 0 10 L 20 10 M 10 0 L 10 20' stroke='white' stroke-width='0.5' fill='none'/></pattern></defs><rect width='100' height='100' fill='url(%23circuit)'/></svg>")`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              RÜTZ
              <br />
              <span className="text-cream text-2xl md:text-3xl font-normal tracking-widest">FROM NATURE'S ROOTS TO YOUR WELL-BEING</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg mb-8 text-cream/90 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              Merging the science of nature with heritage craftsmanship to deliver pure, 
              potent botanical innovations. Born from the union of modern biotechnological 
              precision and nature's oldest wisdom.
            </motion.p>
            
            <motion.div 
              className="bg-forest/10 rounded-lg p-4 mb-6 border-l-4 border-sage"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="text-cream/90 text-sm leading-relaxed">
                <em>"Rooted in tradition, refined by innovation."</em> - Our products are as pure as the roots 
                they come from—crafted with care, backed by science, and inspired by nature's timeless cycles.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg"
                className="bg-white text-forest px-8 py-3 rounded-lg font-semibold hover:bg-cream transition-colors"
                data-testid="explore-products-button"
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-forest transition-colors"
                data-testid="our-impact-button"
              >
                Our Impact
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Indigenous knowledge keeper harvesting traditional medicinal plants in Canadian boreal forest"
              className="rounded-xl shadow-2xl w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Fair Indigenous Partnership Badge */}
            <motion.div 
              className="absolute bottom-4 left-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Badge className="bg-white bg-opacity-95 text-forest px-4 py-2 rounded-lg shadow-lg">
                <Leaf className="w-4 h-4 mr-2" />
                Fair Indigenous Partnership
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
