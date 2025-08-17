import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StrategicOverview from "@/components/StrategicOverview";
import ProductCatalog from "@/components/ProductCatalog";
import PlantExplorerFeature from "@/components/PlantExplorerFeature";
import IndigenousPartnership from "@/components/IndigenousPartnership";
import BrandPromise from "@/components/BrandPromise";
import SupplyChainVisualization from "@/components/SupplyChainVisualization";
import CommunityImpact from "@/components/CommunityImpact";
import CommunityImpactTracker from "@/components/CommunityImpactTracker";
import PersonalizedRecommendationEngine from "@/components/PersonalizedRecommendationEngine";
import ScientificCredibility from "@/components/ScientificCredibility";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

import { trustIndicators } from "@/lib/data";
import { motion } from "framer-motion";


const TrustIndicators = () => (
  <motion.section 
    className="bg-cream py-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
        {trustIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <i className={`fas fa-${indicator.icon} text-scientific`} />
            <span className="font-semibold text-gray-700">{indicator.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default function Home() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <HeroSection />
      <TrustIndicators />
      <StrategicOverview />
      <ProductCatalog showAllProducts={true} />
      <PlantExplorerFeature />
      <IndigenousPartnership />
      <BrandPromise />
      <SupplyChainVisualization />
      <CommunityImpact />
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommunityImpactTracker />
        </div>
      </div>
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PersonalizedRecommendationEngine />
        </div>
      </div>
      <ScientificCredibility />
      <Newsletter />
      <Footer />
      <CartSidebar />

    </div>
  );
}
