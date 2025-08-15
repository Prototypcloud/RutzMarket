import { useState } from "react";
import Header from "@/components/Header";
import ProductCatalog from "@/components/ProductCatalog";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { productCategories } from "@/lib/data";
import { motion } from "framer-motion";

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-forest mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Premium Botanical Extracts
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover our complete collection of ethically sourced botanical extracts, 
              each with its own story of indigenous wisdom and scientific validation.
            </motion.p>
          </div>

          {/* Product Filter */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-cream rounded-lg p-1 flex flex-wrap gap-1">
              {productCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveFilter(category.key)}
                  className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                    activeFilter === category.key
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-600 hover:text-forest"
                  }`}
                  data-testid={`filter-${category.key}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ProductCatalog showAllProducts={true} activeFilter={activeFilter} />
      
      <Footer />
      <CartSidebar />
    </div>
  );
}
