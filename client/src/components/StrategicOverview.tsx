import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { 
  Leaf, 
  Users, 
  Shield, 
  Microscope, 
  Globe, 
  Heart,
  CheckCircle,
  TreePine,
  Beaker,
  Scale,
  Award,
  ArrowRight
} from 'lucide-react';

const StrategicOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const principles = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Rights & Relationships First",
      description: "Communities decide what is shared, how it's used, and how benefits flow back."
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Two Ways of Knowing",
      description: "Indigenous knowledge and modern science work side-by-side—from choosing species to testing and formulation."
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Sustainable Harvests",
      description: "Rotations, no-take zones, and species monitoring protect biodiversity. Collector safety matters, too."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality and Safety at Every Step",
      description: "Correct species ID, validated lab tests for key compounds, contaminant limits, and stability testing."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Clear, Responsible Claims",
      description: "We follow the rules in each country. Traditional-use stories are shared respectfully."
    }
  ];

  const productCategories = [
    {
      category: "Dietary Supplements",
      icon: <Beaker className="w-5 h-5" />,
      items: ["Standardized extract capsules, tablets, softgels", "Powders and drink mixes", "Gummies/chews", "Tinctures (hydroethanolic or glycerite)"]
    },
    {
      category: "Functional Foods & Beverages",
      icon: <Globe className="w-5 h-5" />,
      items: ["Ready-to-drink shots: adaptogenic, nootropic, digestive", "Bars, granolas, fortified snacks", "Fermented products", "Microencapsulated actives"]
    },
    {
      category: "Medical Foods / FSMP",
      icon: <Award className="w-5 h-5" />,
      items: ["Nutrition products for specific needs", "Used under clinician supervision", "Stricter regulatory standard"]
    },
    {
      category: "Cosmeceuticals",
      icon: <Heart className="w-5 h-5" />,
      items: ["Beauty-from-within supplements", "Skin, hair, and nail support", "Topical adjuncts for external use"]
    }
  ];

  const qualityFeatures = [
    "Verified species and origin",
    "Lab-tested markers (polyphenols, essential oils, polysaccharides)",
    "Screens for heavy metals, pesticides, microbes, and allergens",
    "Stable potency through shelf life",
    "Plain-language labels that match what's inside"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-earth-green text-white mb-4 px-4 py-2 text-sm">
            Our Strategic Approach
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-high-contrast text-heading mb-6">
            Indigenous Wild-Harvested Plants
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-earth-green mb-6">
            From Land to Well-Being
          </h2>
          <p className="text-lg text-medium-contrast max-w-4xl mx-auto text-readable leading-relaxed">
            We partner with Indigenous communities to bring wild plants and fungi—from their natural habitats, 
            not farms—into safe, high-quality wellness products. Everything we do starts with consent, 
            fair benefit-sharing, and care for the land.
          </p>
        </motion.div>

        {/* Strategic Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="text-sm">What We Do</TabsTrigger>
              <TabsTrigger value="principles" className="text-sm">Our Principles</TabsTrigger>
              <TabsTrigger value="products" className="text-sm">Products</TabsTrigger>
              <TabsTrigger value="quality" className="text-sm">Quality Promise</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-high-contrast text-heading flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-earth-green" />
                    What "Indigenous Wild Harvest" Means
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-medium-contrast text-readable leading-relaxed">
                    Indigenous wild harvest is the community-led collection of non-cultivated plants and fungi 
                    from their home ecosystems. It is:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-earth-green mt-0.5 flex-shrink-0" />
                      <span className="text-medium-contrast">
                        <strong>Led by Indigenous knowledge-holders</strong> with Free, Prior and Informed Consent (FPIC)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-earth-green mt-0.5 flex-shrink-0" />
                      <span className="text-medium-contrast">
                        <strong>Fair and transparent</strong> with Access-and-Benefit-Sharing (ABS): communities share in decisions, data, and revenue
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-earth-green mt-0.5 flex-shrink-0" />
                      <span className="text-medium-contrast">
                        <strong>Sustainable by design</strong> following Good Agricultural and Collection Practices (GACP) and habitat-protection rules
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-earth-green mt-0.5 flex-shrink-0" />
                      <span className="text-medium-contrast">
                        <strong>Traceable end-to-end</strong> so every batch can be followed from place of origin to finished product
                      </span>
                    </li>
                  </ul>
                  <div className="bg-earth-green/10 p-4 rounded-md border-l-4 border-earth-green">
                    <p className="text-medium-contrast font-medium">
                      <strong>Why it matters:</strong> Wild foods and medicines are rich in natural compounds, shaped by climate and soil. 
                      They also carry cultural meaning—food, ceremony, and health are connected. Honouring that connection leads to better products and better outcomes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="principles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {principles.map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="card-enhanced h-full">
                      <CardHeader>
                        <CardTitle className="text-high-contrast text-heading flex items-center gap-3">
                          <div className="text-earth-green">
                            {principle.icon}
                          </div>
                          {principle.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-medium-contrast text-readable">
                          {principle.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productCategories.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="card-enhanced h-full">
                      <CardHeader>
                        <CardTitle className="text-high-contrast text-heading flex items-center gap-3">
                          <div className="text-earth-green">
                            {category.icon}
                          </div>
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 text-earth-green mt-0.5 flex-shrink-0" />
                              <span className="text-medium-contrast text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-high-contrast text-heading flex items-center gap-2">
                    <Shield className="w-6 h-6 text-earth-green" />
                    Safety & Quality You Can See
                  </CardTitle>
                  <CardDescription>
                    What makes these ingredients special
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-high-contrast mb-3">Quality Standards</h4>
                      <ul className="space-y-2">
                        {qualityFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-earth-green mt-0.5 flex-shrink-0" />
                            <span className="text-medium-contrast text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-high-contrast mb-3">What Makes Them Special</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-botanical-gold mt-0.5 flex-shrink-0" />
                          <span className="text-medium-contrast text-sm">
                            <strong>Biocultural roots:</strong> Connected to place, language, and practice
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Microscope className="w-4 h-4 text-botanical-gold mt-0.5 flex-shrink-0" />
                          <span className="text-medium-contrast text-sm">
                            <strong>Phytochemical richness:</strong> Wild plants often produce higher beneficial compounds
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-botanical-gold mt-0.5 flex-shrink-0" />
                          <span className="text-medium-contrast text-sm">
                            <strong>Full transparency:</strong> Co-branding with communities, clear sourcing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Scale className="w-4 h-4 text-botanical-gold mt-0.5 flex-shrink-0" />
                          <span className="text-medium-contrast text-sm">
                            <strong>Regulation-ready:</strong> Safety, quality, and labeling from day one
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Featured Chaga Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="card-enhanced">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-high-contrast text-heading mb-4">
                Premium Chaga Extract Portfolio
              </CardTitle>
              <CardDescription className="text-lg text-medium-contrast max-w-3xl mx-auto">
                Discover our flagship Chaga collection - eight expertly crafted products featuring this legendary "King of Mushrooms" from the pristine Canadian wilderness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-earth-green">8</div>
                  <div className="text-sm text-medium-contrast">Chaga Products</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-earth-green">5</div>
                  <div className="text-sm text-medium-contrast">Product Categories</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-earth-green">100%</div>
                  <div className="text-sm text-medium-contrast">Wild Harvested</div>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-earth-green text-white hover:bg-earth-green/90 px-8 py-3"
                >
                  <Link href="/chaga-portfolio">
                    <span className="flex items-center">
                      Explore Chaga Portfolio
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="card-enhanced bg-earth-green/5 border-earth-green/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-high-contrast text-heading mb-4">
                Our Promise to Communities and Land
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-8 h-8 text-earth-green mb-2" />
                  <h4 className="font-semibold text-high-contrast mb-2">Fair Benefits</h4>
                  <p className="text-medium-contrast text-sm">
                    Revenue share, jobs, training, and co-ownership of data where agreed
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Scale className="w-8 h-8 text-earth-green mb-2" />
                  <h4 className="font-semibold text-high-contrast mb-2">Shared Governance</h4>
                  <p className="text-medium-contrast text-sm">
                    Community voices at the decision table
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <TreePine className="w-8 h-8 text-earth-green mb-2" />
                  <h4 className="font-semibold text-high-contrast mb-2">Stewardship</h4>
                  <p className="text-medium-contrast text-sm">
                    Harvesting that protects species and habitats for generations
                  </p>
                </div>
              </div>
              <p className="text-lg text-earth-green font-semibold mt-8">
                People. Planet. Tradition. Science. That's the path from wild harvest to well-being.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StrategicOverview;