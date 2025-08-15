import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { TreePine, FlaskConical, Heart, BarChart3, Shield, Infinity } from "lucide-react";

const BrandPromise: React.FC = () => {
  const promises = [
    {
      title: "Transparent Sourcing Reports",
      description: "Every product includes detailed traceability from indigenous partnerships to your doorstep",
      icon: <BarChart3 className="h-6 w-6" />,
      metric: "100% Supply Chain Visibility",
      color: "text-rutz-forest"
    },
    {
      title: "Carbon Footprint Tracking",
      description: "Complete environmental impact assessment with carbon-neutral shipping options",
      icon: <TreePine className="h-6 w-6" />,
      metric: "Net Zero by 2025",
      color: "text-green-600"
    },
    {
      title: "Community Project Updates",
      description: "Regular reports on schools built, families supported, and cultural preservation programs",
      icon: <Heart className="h-6 w-6" />,
      metric: "12 Schools Funded",
      color: "text-red-500"
    },
    {
      title: "Scientific Validation",
      description: "Fraunhofer-certified extraction processes with published research and clinical data",
      icon: <FlaskConical className="h-6 w-6" />,
      metric: "15+ Research Papers",
      color: "text-rutz-gold"
    }
  ];

  const messagingPillars = [
    {
      pillar: "Rooted in Tradition",
      description: "Our journey begins in the wild, where plants grow as they have for centuries.",
      example: "Indigenous harvesters in natural settings with centuries-old knowledge"
    },
    {
      pillar: "Perfected by Science", 
      description: "From lab-tested potency to clinically proven benefits.",
      example: "Advanced extraction processes validated by Fraunhofer research institute"
    },
    {
      pillar: "Giving Back",
      description: "A portion of every sale goes to the communities and ecosystems that make RÜTZ possible.",
      example: "Education programs, infrastructure development, and biodiversity conservation"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-rutz-cream/30 to-rutz-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Promise Seal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Shield className="h-10 w-10 text-rutz-forest" />
              <span className="absolute -top-1 -right-1 text-green-600 text-lg">✓</span>
            </div>
            <h2 className="text-4xl font-bold text-rutz-forest">The RÜTZ Promise</h2>
          </div>
          
          <p className="text-xl text-rutz-sage max-w-4xl mx-auto leading-relaxed">
            Transparent reports on sourcing impact, carbon footprint, and community projects. 
            Because nature and society give so much, we give back—investing in education, 
            infrastructure, and sustainability programs.
          </p>

          {/* Fair Partnership Seal */}
          <div className="inline-flex items-center gap-3 bg-rutz-gold/15 px-6 py-4 rounded-full border-2 border-rutz-gold/30">
            <div className="relative">
              <TreePine className="h-6 w-6 text-rutz-forest" />
              <span className="absolute -top-1 -right-1 text-sm">🤝</span>
            </div>
            <span className="font-bold text-rutz-forest text-lg">Fair Indigenous Partnership</span>
            <Infinity className="h-6 w-6 text-rutz-gold" />
          </div>
        </motion.div>

        {/* Promise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {promises.map((promise, index) => (
            <motion.div
              key={promise.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-rutz-gold/20 hover:border-rutz-gold/40 transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader className="text-center pb-3">
                  <div className={`${promise.color} flex justify-center mb-3`}>
                    {promise.icon}
                  </div>
                  <CardTitle className="text-rutz-forest text-lg leading-tight">{promise.title}</CardTitle>
                  <Badge variant="outline" className="border-rutz-gold text-rutz-forest font-medium w-fit mx-auto">
                    {promise.metric}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-rutz-sage text-center leading-relaxed">
                    {promise.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Messaging Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="border-rutz-gold/30 bg-gradient-to-r from-rutz-forest/5 to-rutz-gold/5">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-rutz-forest">Our Brand Story</CardTitle>
              <CardDescription className="text-lg text-rutz-sage">
                From untouched landscapes to advanced research labs—uniting heritage and science
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {messagingPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.pillar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="space-y-3"
                >
                  {index > 0 && <Separator className="bg-rutz-gold/20" />}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    <div className="space-y-2">
                      <h3 className="font-bold text-rutz-forest text-lg">{pillar.pillar}</h3>
                      <p className="text-rutz-sage leading-relaxed">{pillar.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-rutz-sage/80 italic leading-relaxed bg-rutz-gold/5 p-3 rounded-lg border-l-2 border-rutz-gold/30">
                        {pillar.example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Package Copy Example */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <Card className="border-2 border-rutz-gold/40 bg-gradient-to-br from-rutz-gold/10 to-rutz-forest/5 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">🍄</span>
                  <h3 className="text-xl font-bold text-rutz-forest">Example: RÜTZ Chaga Extract</h3>
                  <span className="text-2xl">🧪</span>
                </div>
                
                <div className="bg-white/50 p-4 rounded-lg border border-rutz-gold/20">
                  <p className="text-rutz-forest leading-relaxed italic">
                    "Harvested by indigenous communities in pristine Canadian boreal forests, 
                    refined in Germany using Fraunhofer-validated processes. Every capsule 
                    supports your health—and their future."
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-rutz-sage">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-rutz-forest rounded-full"></span>
                    <span>Indigenous Partnership</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-rutz-gold rounded-full"></span>
                    <span>Fraunhofer Certified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Community Impact</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandPromise;