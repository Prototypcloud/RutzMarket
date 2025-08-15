import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { ImpactMetrics } from "@shared/schema";

export default function CommunityImpact() {
  const { data: impact, isLoading } = useQuery<ImpactMetrics>({
    queryKey: ["/api/impact"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="h-8 bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-600 rounded mb-8"></div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-600 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!impact) {
    return (
      <section className="py-16 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
          <p className="text-cream">Impact data is currently unavailable.</p>
        </div>
      </section>
    );
  }

  const impactImages = [
    {
      src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      alt: "Community school built through partnership programs"
    },
    {
      src: "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      alt: "Indigenous farmers working in sustainable agriculture project"
    },
    {
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      alt: "Forest conservation project with protected biodiversity"
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      alt: "Community members receiving fair trade payments"
    }
  ];

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    }
    return `€${(num / 1000).toFixed(0)}K`;
  };

  return (
    <section className="py-16 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Giving Back to Communities
            </h2>
            <p className="text-cream text-lg mb-8">
              Every purchase supports education, infrastructure, and sustainability 
              programs in our partner communities. This is our promise.
            </p>
            
            {/* Impact Metrics */}
            <motion.div 
              className="grid grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-sage"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {impact.schoolsBuilt}
                </motion.div>
                <div className="text-sm text-cream">Schools Built</div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-sage"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {impact.familiesSupported.toLocaleString()}
                </motion.div>
                <div className="text-sm text-cream">Families Supported</div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-sage"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {impact.hectaresProtected.toLocaleString()}
                </motion.div>
                <div className="text-sm text-cream">Hectares Protected</div>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-sage"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {formatAmount(impact.amountReinvested)}
                </motion.div>
                <div className="text-sm text-cream">Reinvested</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button 
                className="bg-sage text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-forest transition-colors"
                data-testid="view-impact-report-button"
              >
                View Impact Report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {impactImages.map((image, index) => (
              <motion.img
                key={index}
                src={image.src}
                alt={image.alt}
                className="rounded-lg shadow-lg object-cover h-32 w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
