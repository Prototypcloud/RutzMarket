import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Leaf, Heart, Shield, TreePine } from "lucide-react";

const sourcingPrinciples = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Fair Indigenous Partnerships",
    description: "Direct partnerships with indigenous communities, ensuring fair compensation and respect for traditional knowledge",
    details: "We work directly with indigenous elders and knowledge keepers, sharing profits and ensuring cultural protocols are respected."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Sustainable Harvesting",
    description: "Environmentally responsible collection methods that protect plant populations for future generations",
    details: "Our harvesting follows traditional seasonal cycles and sustainable quotas to maintain ecosystem balance."
  },
  {
    icon: <TreePine className="w-8 h-8" />,
    title: "Wild-Crafted Excellence",
    description: "Plants sourced from pristine Canadian wilderness areas, free from industrial contamination",
    details: "Remote boreal forest locations ensure the highest potency and purity of our botanical extracts."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Empowerment",
    description: "Supporting local communities through education, employment, and sustainable economic development",
    details: "Training programs and fair-trade partnerships create lasting positive impact in source communities."
  }
];

const sourcingLocations = [
  {
    region: "Boreal Forests of Northern Ontario",
    plants: ["Chaga", "Birch Bark", "Labrador Tea"],
    community: "Anishinaabe Nation",
    coordinates: "49.2827° N, 84.3107° W"
  },
  {
    region: "Arctic Tundra, Nunavut",
    plants: ["Arctic Willow", "Cloudberry", "Fireweed"],
    community: "Inuit Communities",
    coordinates: "63.7467° N, 68.5170° W"
  },
  {
    region: "Rocky Mountain Foothills, Alberta",
    plants: ["Wild Rose Hips", "Juniper", "Sage"],
    community: "Blackfoot Confederacy",
    coordinates: "51.1784° N, 115.5708° W"
  },
  {
    region: "Pacific Coast Rainforests, BC",
    plants: ["Devil's Club", "Red Cedar", "Wild Ginger"],
    community: "Coast Salish Nations",
    coordinates: "49.2827° N, 123.1207° W"
  }
];

export default function Sourcing() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest to-sage text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ethical Sourcing
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Honoring indigenous wisdom while protecting Canada's pristine wilderness
            </p>
            <Badge className="bg-cream text-forest px-6 py-2 text-lg">
              <Leaf className="w-5 h-5 mr-2" />
              Traditional Knowledge + Sustainable Practices
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Sourcing Principles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Our Sourcing Principles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every botanical extract we source follows strict ethical and environmental standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sourcingPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-forest">
                        {principle.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-forest">
                          {principle.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {principle.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {principle.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Locations */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Sacred Sourcing Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our partnerships span Canada's most pristine wilderness areas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sourcingLocations.map((location, index) => (
              <motion.div
                key={location.region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center text-forest">
                      <MapPin className="w-5 h-5 mr-2" />
                      {location.region}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Partnership with {location.community}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-forest mb-2">
                          Traditional Plants
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {location.plants.map((plant) => (
                            <Badge key={plant} variant="outline" className="text-sage border-sage">
                              {plant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {location.coordinates}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-16 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sourcing with Purpose
            </h2>
            <p className="text-xl text-cream mb-8 leading-relaxed">
              Every purchase supports indigenous communities, protects traditional knowledge, 
              and ensures the sustainable future of Canada's botanical heritage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-cream">95%</div>
                <div className="text-lg">Wild-Harvested</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">12+</div>
                <div className="text-lg">Community Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">100%</div>
                <div className="text-lg">Fair Trade</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}