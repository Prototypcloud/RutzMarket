import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";
import type { SupplyChainStep } from "@shared/schema";

export default function SupplyChainVisualization() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [productId, setProductId] = useState("");

  const { data: steps = [], isLoading } = useQuery<SupplyChainStep[]>({
    queryKey: ["/api/supply-chain"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const selectedStepData = steps.find(step => step.id === selectedStep);

  return (
    <section className="py-16 bg-gradient-to-br from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4 tracking-wide uppercase" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Nature Meets Science
          </h2>
          <p className="text-slate-gray max-w-3xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Follow our transparent journey from sustainable harvesting to precision extraction. 
            <em>"Rooted in tradition, refined by innovation."</em> Every step combines heritage 
            craftsmanship with modern biotechnological excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="text-center group cursor-pointer"
              onClick={() => setSelectedStep(step.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              data-testid={`supply-chain-step-${step.stepNumber}`}
            >
              <div className="relative mb-6">
                <motion.img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-24 h-24 rounded-full mx-auto shadow-lg object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute -bottom-2 -right-2 bg-sage text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.stepNumber}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Details Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStep || "default"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white rounded-xl shadow-lg p-8">
              {selectedStepData ? (
                <div>
                  <h3 className="text-2xl font-bold text-forest mb-4">
                    {selectedStepData.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {selectedStepData.details}
                  </p>
                  
                  {selectedStepData.location && (
                    <div className="mb-4">
                      <span className="font-semibold text-forest">Location: </span>
                      <span className="text-gray-700">{selectedStepData.location}</span>
                    </div>
                  )}
                  
                  {selectedStepData.certifications && selectedStepData.certifications.length > 0 && (
                    <div>
                      <span className="font-semibold text-forest">Certifications: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedStepData.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="bg-sage text-white px-3 py-1 rounded-full text-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-forest mb-4">
                    Track Your Product Journey
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Scan the QR code on your product to see its complete supply chain story
                  </p>
                  
                  {/* QR Scanner Simulation */}
                  <div className="bg-cream rounded-lg p-8 max-w-md mx-auto">
                    <QrCode className="text-6xl text-forest mb-4 mx-auto w-16 h-16" />
                    <p className="text-sm text-gray-600 mb-4">Scan QR code or enter product ID</p>
                    <Input
                      type="text"
                      placeholder="Enter Product ID (e.g., RUTZ-TUR-001)"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full"
                      data-testid="product-id-input"
                    />
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
