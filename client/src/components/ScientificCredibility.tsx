import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FlaskConical, Award, ArrowRight } from "lucide-react";
import type { ImpactMetrics } from "@shared/schema";

export default function ScientificCredibility() {
  const { data: impact, isLoading } = useQuery<ImpactMetrics>({
    queryKey: ["/api/impact"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const researchMetrics = [
    {
      icon: FileText,
      title: "Bio-Based Research Projects",
      value: impact?.researchPapers || 0,
      description: "Active research in sustainable circular economy and plant-based innovations",
      color: "text-scientific"
    },
    {
      icon: FlaskConical,
      title: "AI-Supported Quality Systems",
      value: impact?.clinicalTrials || 0,
      description: "Advanced IR spectroscopy with artificial intelligence for product validation",
      color: "text-scientific"
    },
    {
      icon: Award,
      title: "Climate Neutrality Innovations",
      value: impact?.patents || 0,
      description: "Resource-saving processes replacing fossil materials with plant-based alternatives",
      color: "text-scientific"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4 tracking-wide uppercase" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Purity & Potency
          </h2>
          <p className="text-slate-gray max-w-4xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Every drop, every gram, from the source.</strong> Our botanical extracts undergo rigorous 
            testing and precision extraction to preserve maximum potency while ensuring pharmaceutical-grade 
            purity. Transparency in every step from harvest to final product.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {researchMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-cream rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <metric.icon className={`w-12 h-12 ${metric.color} mb-4 mx-auto`} />
                  <h3 className="text-xl font-semibold text-forest mb-2">
                    {metric.title}
                  </h3>
                  <motion.div 
                    className="text-3xl font-bold text-forest mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    {metric.value}
                  </motion.div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Fraunhofer Innovation Showcase */}
        <motion.div
          className="bg-gradient-to-r from-scientific to-sage rounded-xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Fraunhofer IVV Innovation</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-botanical-gold rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Heritage Craftsmanship</p>
                    <p className="text-sm text-cream/90">European botanical traditions meet modern biotechnological precision</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-botanical-gold rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Sustainable Innovation</p>
                    <p className="text-sm text-cream/90">Ethical sourcing with eco-conscious packaging and clean production</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-botanical-gold rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Complete Transparency</p>
                    <p className="text-sm text-cream/90">Clear origin, processing, and efficacy information for every product</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cream mb-2">2025</div>
              <p className="text-sm text-cream mb-6">Leading innovation in sustainable bio-based research</p>
              <Button 
                className="bg-white text-scientific px-6 py-2 rounded-lg font-semibold hover:bg-cream transition-colors"
                data-testid="view-research-library-button"
              >
                Research Partnership
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
