import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Heart, Globe, TreePine, Users, Award, Infinity } from "lucide-react";

const IndigenousPartnership: React.FC = () => {
  const partnerships = [
    {
      region: "Siberian Taiga",
      community: "Indigenous Chaga Harvesters",
      plant: "Chaga Mushroom",
      impact: "Supporting 200+ families with fair trade practices",
      icon: "🍄",
      certifications: ["Wild-Harvested", "Fair Trade", "Cultural Preservation"]
    },
    {
      region: "Kerala, India", 
      community: "Traditional Farming Cooperatives",
      plant: "Turmeric",
      impact: "Funded 3 schools and clean water for 8 villages",
      icon: "🌿",
      certifications: ["Organic", "Fair Trade", "Heritage Methods"]
    },
    {
      region: "Rajasthan, India",
      community: "Ayurvedic Knowledge Keepers",
      plant: "Ashwagandha",
      impact: "Educational programs preserving traditional wisdom",
      icon: "🌱",
      certifications: ["Organic", "Traditional Medicine Validated", "Community Partnership"]
    }
  ];

  const brandValues = [
    {
      title: "Heritage",
      description: "Honoring indigenous knowledge and cultural traditions",
      icon: <TreePine className="h-6 w-6" />,
      color: "text-rutz-forest"
    },
    {
      title: "Scientific Excellence",
      description: "Grounded in Fraunhofer's century of research and innovation",
      icon: <Award className="h-6 w-6" />,
      color: "text-rutz-gold"
    },
    {
      title: "Sustainability",
      description: "Protecting ecosystems and biodiversity for future generations",
      icon: <Globe className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "Fairness",
      description: "Equitable trade and community reinvestment programs",
      icon: <Heart className="h-6 w-6" />,
      color: "text-red-500"
    },
    {
      title: "Integrity",
      description: "Complete transparency from root to finished product",
      icon: <Users className="h-6 w-6" />,
      color: "text-rutz-sage"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-rutz-cream via-white to-rutz-forest/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Infinity className="h-8 w-8 text-rutz-gold" />
              <span className="absolute -top-1 -right-1 text-green-600 text-sm">🤝</span>
            </div>
            <h2 className="text-4xl font-bold text-rutz-forest">Fair Indigenous Partnership</h2>
          </div>
          <p className="text-xl text-rutz-sage max-w-4xl mx-auto leading-relaxed">
            Our supply chain is our formula—where ethics, heritage, and R&D converge. 
            Every botanical extract honors the indigenous communities who have been guardians 
            of this knowledge for generations.
          </p>
        </motion.div>

        {/* Partnership Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {partnerships.map((partnership, index) => (
            <motion.div
              key={partnership.region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-rutz-gold/20 hover:border-rutz-gold/40 transition-all duration-300 hover:shadow-lg h-full">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-2">{partnership.icon}</div>
                  <CardTitle className="text-rutz-forest text-lg">{partnership.region}</CardTitle>
                  <CardDescription className="text-rutz-sage">
                    {partnership.community}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <Badge variant="outline" className="border-rutz-gold text-rutz-forest font-medium">
                        {partnership.plant}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-rutz-sage text-center leading-relaxed">
                      {partnership.impact}
                    </p>
                    
                    <Separator className="bg-rutz-gold/20" />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-rutz-forest text-center">Certifications</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {partnership.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Brand Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="border-rutz-gold/30 bg-gradient-to-r from-rutz-gold/5 to-rutz-forest/5">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-rutz-forest">Our Brand Values</CardTitle>
              <CardDescription className="text-lg text-rutz-sage">
                The foundation of every partnership and every product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {brandValues.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-center space-y-3"
                  >
                    <div className={`${value.color} flex justify-center`}>
                      {value.icon}
                    </div>
                    <h3 className="font-semibold text-rutz-forest text-sm">{value.title}</h3>
                    <p className="text-xs text-rutz-sage leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fair Partnership Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-rutz-gold/10 px-6 py-3 rounded-full border border-rutz-gold/30">
            <div className="relative">
              <TreePine className="h-6 w-6 text-rutz-forest" />
              <span className="absolute -top-1 -right-1 text-sm">🤝</span>
            </div>
            <span className="font-semibold text-rutz-forest">Fair Indigenous Partnership Certified</span>
            <Infinity className="h-5 w-5 text-rutz-gold" />
          </div>
          <p className="text-sm text-rutz-sage mt-3 max-w-2xl mx-auto">
            Custom icon combining plant, hand, and infinity loop—symbolizing sustainable, 
            respectful, and lasting partnerships with indigenous communities.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IndigenousPartnership;