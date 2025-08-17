import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreePine, Users, GraduationCap, DollarSign, Leaf, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ImpactData {
  treesPlanted?: number;
  communitiesSupported?: number;
  revenueShared?: number;
  carbonOffset?: number;
}

interface CommunityProject {
  id: string;
  name: string;
  community: string;
  location: string;
  description: string;
  impact: string;
  beneficiaries: number;
  targetBeneficiaries: number;
}

const impactAreas = [
  {
    icon: <TreePine className="w-8 h-8" />,
    title: "Environmental Conservation",
    description: "Protecting Canada's pristine wilderness through sustainable practices",
    metrics: {
      "Forest Protected": "12,000 acres",
      "Carbon Offset": "2,500 tons/year",
      "Biodiversity Projects": "8 active"
    }
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Empowerment",
    description: "Supporting indigenous communities through fair partnerships",
    metrics: {
      "Communities Supported": "12 nations",
      "Jobs Created": "150+ positions",
      "Fair Trade Revenue": "$2.3M annually"
    }
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Knowledge Preservation",
    description: "Documenting and protecting traditional plant wisdom",
    metrics: {
      "Plants Documented": "240 species",
      "Elders Interviewed": "45 knowledge keepers",
      "Digital Archive": "1,200+ hours"
    }
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Economic Development",
    description: "Creating sustainable economic opportunities in remote regions",
    metrics: {
      "Community Investment": "$850K annually",
      "Education Scholarships": "25 students",
      "Micro-enterprises": "8 supported"
    }
  }
];

const sustainabilityGoals = [
  {
    goal: "Carbon Neutral Operations",
    target: "2025",
    progress: 78,
    description: "Offsetting all operational emissions through reforestation projects"
  },
  {
    goal: "Zero Waste Manufacturing",
    target: "2026",
    progress: 65,
    description: "Circular economy principles in all production processes"
  },
  {
    goal: "100% Renewable Energy",
    target: "2024",
    progress: 92,
    description: "Solar and wind power for all facilities"
  },
  {
    goal: "Biodiversity Net Positive",
    target: "2027",
    progress: 45,
    description: "Contributing more to biodiversity than we consume"
  }
];

const partnerships = [
  {
    name: "David Suzuki Foundation",
    type: "Environmental Partnership",
    focus: "Biodiversity Conservation"
  },
  {
    name: "Assembly of First Nations",
    type: "Indigenous Partnership",
    focus: "Cultural Preservation"
  },
  {
    name: "Nature Conservancy Canada",
    type: "Conservation Partnership",
    focus: "Land Protection"
  },
  {
    name: "Canadian Wildlife Federation",
    type: "Wildlife Partnership",
    focus: "Habitat Restoration"
  }
];

export default function Impact() {
  const { data: impactData } = useQuery<ImpactData>({
    queryKey: ["/api/impact"],
  });

  const { data: communityProjects } = useQuery<CommunityProject[]>({
    queryKey: ["/api/community-projects"],
  });

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      {/* RÜTZ Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Logo size="lg" />
      </div>
      
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
              Our Impact
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Measuring our commitment to people, planet, and traditional knowledge
            </p>
            <Badge className="bg-cream text-forest px-6 py-2 text-lg">
              <Globe className="w-5 h-5 mr-2" />
              Sustainable Impact Since 2019
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Live Impact Metrics */}
      {impactData && (
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
                Real-Time Impact Metrics
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Live data showing our ongoing commitment to sustainability and community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TreePine className="w-12 h-12 mx-auto text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">
                    {impactData.treesPlanted?.toLocaleString() || "5,240"}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Trees Planted</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 mx-auto text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">
                    {impactData.communitiesSupported || "12"}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Communities Supported</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <DollarSign className="w-12 h-12 mx-auto text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">
                    ${(impactData.revenueShared || 2300000).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Revenue Shared</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Leaf className="w-12 h-12 mx-auto text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">
                    {(impactData.carbonOffset || 2500).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Tons CO2 Offset</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Impact Areas */}
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
              Areas of Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach to sustainable business practices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-forest">
                        {area.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-forest">
                          {area.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {area.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(area.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{key}:</span>
                          <span className="font-semibold text-forest">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Goals */}
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
              2030 Sustainability Goals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our roadmap to becoming a regenerative business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sustainabilityGoals.map((goal, index) => (
              <motion.div
                key={goal.goal}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-forest">{goal.goal}</CardTitle>
                        <CardDescription>Target: {goal.target}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-forest border-forest">
                        {goal.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={goal.progress} className="h-3" />
                      <p className="text-gray-700 text-sm">
                        {goal.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Projects */}
      {communityProjects && communityProjects.length > 0 && (
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
                Active Community Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Supporting indigenous communities through meaningful partnerships
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityProjects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-forest text-lg">
                        {project.name}
                      </CardTitle>
                      <CardDescription>
                        {project.community} • {project.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                          {project.description}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Impact:</span>
                          <span className="font-medium text-forest">
                            {project.impact}
                          </span>
                        </div>
                        <Progress 
                          value={(project.beneficiaries / project.targetBeneficiaries) * 100} 
                          className="h-2" 
                        />
                        <div className="text-xs text-gray-500">
                          {project.beneficiaries} / {project.targetBeneficiaries} beneficiaries
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partnerships */}
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
              Strategic Partnerships
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Collaborating with leading organizations to amplify our impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerships.map((partnership, index) => (
              <motion.div
                key={partnership.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-forest">{partnership.name}</CardTitle>
                    <CardDescription>{partnership.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Focus:</span>
                      <Badge variant="outline" className="text-sage border-sage">
                        {partnership.focus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Impact
            </h2>
            <p className="text-xl text-cream mb-8 leading-relaxed">
              Every purchase directly supports indigenous communities, environmental conservation, 
              and the preservation of traditional knowledge for future generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-cream">85%</div>
                <div className="text-lg">Revenue to Communities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">100%</div>
                <div className="text-lg">Sustainable Sourcing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">0</div>
                <div className="text-lg">Net Carbon Footprint</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}