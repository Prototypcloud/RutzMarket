import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Brain, 
  Shield, 
  Leaf, 
  Users, 
  Search,
  ArrowRight,
  Stethoscope,
  Activity,
  Thermometer,
  Droplets,
  Moon,
  Sun,
  Baby,
  Flower2,
  Zap,
  Scale
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";

// Health concerns organized by categories
const healthConcerns = {
  "Digestive & Metabolic": [
    {
      id: "digestive-gut",
      name: "Digestive & Gut Health",
      description: "Probiotics, enzymes, bloating/IBS, reflux support",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-green-500",
      keywords: ["probiotics", "enzymes", "bloating", "IBS", "reflux", "gut", "digestion"]
    },
    {
      id: "weight-metabolic",
      name: "Weight Management & Metabolic Health", 
      description: "Healthy weight support and metabolic function",
      icon: <Scale className="w-6 h-6" />,
      color: "bg-orange-500",
      keywords: ["weight", "metabolism", "fat burning", "appetite", "glucose"]
    },
    {
      id: "thyroid",
      name: "Thyroid Support",
      description: "Thyroid function and hormone balance",
      icon: <Thermometer className="w-6 h-6" />,
      color: "bg-purple-500",
      keywords: ["thyroid", "hormone", "metabolism", "energy", "T3", "T4"]
    }
  ],
  "Cardiovascular & Respiratory": [
    {
      id: "cardiovascular",
      name: "Cardiovascular Health",
      description: "Heart health, blood pressure, circulation support",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-500",
      keywords: ["heart", "blood pressure", "circulation", "cholesterol", "cardiovascular"]
    },
    {
      id: "respiratory",
      name: "Respiratory & Lung Support",
      description: "Bronchial health, breathing support beyond cold & flu",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-blue-500",
      keywords: ["lungs", "breathing", "bronchial", "respiratory", "airways"]
    }
  ],
  "Mental & Neurological": [
    {
      id: "brain-cognitive",
      name: "Brain & Cognitive Support",
      description: "Memory, focus, mental clarity, neuroprotection",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-indigo-500",
      keywords: ["brain", "memory", "focus", "cognitive", "mental clarity", "nootropic"]
    },
    {
      id: "stress-mood",
      name: "Stress Relief & Mood",
      description: "Emotional balance, anxiety relief, mood support",
      icon: <Moon className="w-6 h-6" />,
      color: "bg-teal-500",
      keywords: ["stress", "anxiety", "mood", "depression", "emotional", "adaptogen"]
    },
    {
      id: "sleep",
      name: "Sleep Support",
      description: "Natural sleep aids and sleep quality improvement",
      icon: <Moon className="w-6 h-6" />,
      color: "bg-violet-500",
      keywords: ["sleep", "insomnia", "rest", "melatonin", "relaxation"]
    }
  ],
  "Women's & Reproductive Health": [
    {
      id: "womens-cycle",
      name: "Women's Cycle Support",
      description: "PMS relief, menstrual comfort, hormone balance",
      icon: <Flower2 className="w-6 h-6" />,
      color: "bg-pink-500",
      keywords: ["PMS", "menstrual", "cycle", "cramps", "hormone balance"]
    },
    {
      id: "menopause",
      name: "Menopause Support", 
      description: "Hot flashes, hormonal changes, comfort during transition",
      icon: <Sun className="w-6 h-6" />,
      color: "bg-amber-500",
      keywords: ["menopause", "hot flashes", "hormones", "perimenopause"]
    },
    {
      id: "fertility",
      name: "Fertility Support",
      description: "Men's and women's reproductive health support",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-rose-500",
      keywords: ["fertility", "reproductive", "conception", "ovulation"]
    },
    {
      id: "prenatal-postnatal",
      name: "Prenatal & Postnatal Support",
      description: "Pregnancy nutrition and postpartum recovery",
      icon: <Baby className="w-6 h-6" />,
      color: "bg-emerald-500",
      keywords: ["pregnancy", "prenatal", "postnatal", "lactation", "maternal"]
    },
    {
      id: "sexual-health",
      name: "Sexual Health & Libido",
      description: "Natural libido support for men and women",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-400",
      keywords: ["libido", "sexual", "performance", "desire", "vitality"]
    }
  ],
  "Energy & Vitality": [
    {
      id: "energy-fatigue",
      name: "Energy & Fatigue Relief",
      description: "Natural energy boosters and fatigue support",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-yellow-500",
      keywords: ["energy", "fatigue", "stamina", "endurance", "vitality"]
    },
    {
      id: "adrenal-support",
      name: "Adrenal Support",
      description: "Adrenal gland health and stress adaptation",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-orange-600",
      keywords: ["adrenal", "cortisol", "stress adaptation", "HPA axis"]
    },
    {
      id: "healthy-aging",
      name: "Healthy Aging & Longevity",
      description: "Anti-aging support and cellular health",
      icon: <Leaf className="w-6 h-6" />,
      color: "bg-green-600",
      keywords: ["aging", "longevity", "antioxidant", "cellular health", "anti-aging"]
    }
  ],
  "Specialized Support": [
    {
      id: "kidney-bladder",
      name: "Kidney & Bladder Health",
      description: "Urinary system support beyond UTI treatment",
      icon: <Droplets className="w-6 h-6" />,
      color: "bg-cyan-500",
      keywords: ["kidney", "bladder", "urinary", "detox", "filtration"]
    },
    {
      id: "oral-dental",
      name: "Oral & Dental Health",
      description: "Teeth, gums, and breath support",
      icon: <Stethoscope className="w-6 h-6" />,
      color: "bg-gray-500",
      keywords: ["oral", "dental", "teeth", "gums", "breath", "mouth"]
    },
    {
      id: "pain-comfort",
      name: "Pain & Comfort",
      description: "Natural pain relief including headaches and migraines",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-red-600",
      keywords: ["pain", "headache", "migraine", "inflammation", "comfort"]
    },
    {
      id: "childrens-health",
      name: "Children's Health",
      description: "Safe, gentle support for kids' health needs",
      icon: <Baby className="w-6 h-6" />,
      color: "bg-blue-400",
      keywords: ["children", "kids", "pediatric", "gentle", "safe"]
    },
    {
      id: "hydration-electrolytes",
      name: "Hydration & Electrolytes",
      description: "Cramp prevention, heat support, endurance",
      icon: <Droplets className="w-6 h-6" />,
      color: "bg-blue-300",
      keywords: ["hydration", "electrolytes", "cramps", "endurance", "minerals"]
    }
  ]
};

export default function HealthConcerns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);

  // Flatten all concerns for search
  const allConcerns = Object.values(healthConcerns).flat();
  
  // Filter concerns based on search and category
  const filteredConcerns = allConcerns.filter(concern => {
    const matchesSearch = searchTerm === "" || 
      concern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedCategory === "all") return matchesSearch;
    
    const categoryMatches = Object.entries(healthConcerns).some(([category, concerns]) => 
      category === selectedCategory && concerns.includes(concern)
    );
    
    return matchesSearch && categoryMatches;
  });

  const categories = ["all", ...Object.keys(healthConcerns)];

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      {/* RÜTZ Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Link href="/">
          <Logo size="lg" />
        </Link>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Health Concerns Matrix
            </h1>
            <p className="text-xl text-cream/90 max-w-3xl mx-auto mb-8">
              Discover targeted botanical solutions for your specific health needs, backed by indigenous wisdom and modern science
            </p>
            <Badge className="bg-botanical-gold text-forest px-4 py-2 text-lg">
              AI-Powered Recommendations
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search health concerns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="health-concerns-search"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="Digestive & Metabolic" className="text-xs">Digestive</TabsTrigger>
                <TabsTrigger value="Cardiovascular & Respiratory" className="text-xs">Heart & Lung</TabsTrigger>
                <TabsTrigger value="Mental & Neurological" className="text-xs">Mental</TabsTrigger>
                <TabsTrigger value="Women's & Reproductive Health" className="text-xs">Women's</TabsTrigger>
                <TabsTrigger value="Energy & Vitality" className="text-xs">Energy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Health Concerns Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredConcerns.map((concern, index) => (
              <motion.div
                key={concern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${concern.color} text-white`}>
                        {concern.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        AI Enhanced
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-forest group-hover:text-sage transition-colors">
                      {concern.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {concern.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/ai-recommendations?concern=${concern.id}`}>
                      <Button 
                        className="w-full bg-forest hover:bg-sage text-white"
                        data-testid={`concern-${concern.id}`}
                      >
                        Get Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredConcerns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No health concerns found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse all categories
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-6">
              How Our Health Matrix Works
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system combines traditional indigenous knowledge with modern research to provide personalized botanical recommendations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-forest text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">1. Select Your Concern</h3>
              <p className="text-gray-600">
                Choose from our comprehensive matrix of health concerns, each carefully categorized and researched
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-sage text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our system analyzes your needs using indigenous healing wisdom and scientific research data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-botanical-gold text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-3">3. Personalized Recommendations</h3>
              <p className="text-gray-600">
                Receive tailored product suggestions with indigenous healers' insights and usage guidance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar />
    </div>
  );
}