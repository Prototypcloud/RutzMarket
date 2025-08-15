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
      title: "Research Papers",
      value: impact?.researchPapers || 0,
      description: "Published studies validating our extraction methods and efficacy",
      color: "text-scientific"
    },
    {
      icon: FlaskConical,
      title: "Clinical Trials",
      value: impact?.clinicalTrials || 0,
      description: "Rigorous trials proving safety and bioavailability of our extracts",
      color: "text-scientific"
    },
    {
      icon: Award,
      title: "Patents Granted",
      value: impact?.patents || 0,
      description: "Innovative extraction technologies developed with Fraunhofer",
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
          <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
            Backed by Science
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our partnership with Fraunhofer Institute ensures every extract meets 
            the highest standards of purity, potency, and safety.
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

        {/* Fraunhofer Partnership Showcase */}
        <motion.div
          className="bg-gradient-to-r from-scientific to-sage rounded-xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Fraunhofer Partnership</h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Europe's largest application-oriented research organization validates 
            our commitment to scientific excellence and innovation in botanical extraction.
          </p>
          <Button 
            className="bg-white text-scientific px-8 py-3 rounded-lg font-semibold hover:bg-cream transition-colors"
            data-testid="view-research-library-button"
          >
            View Research Library
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
