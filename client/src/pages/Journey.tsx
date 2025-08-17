import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Heart, Leaf, Sun, Moon, Ear, BookOpen, MessageCircle, Calendar, Play } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface HealerCategory {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  icon: any;
  color: string;
  practitioners: number;
  availability: string;
  videoUrl?: string;
}

const healerCategories: HealerCategory[] = [
  {
    id: "indigenous-healer",
    name: "healer.indigenousHealer",
    description: "healer.indigenousHealerDesc",
    specialties: ["Plant Medicine", "Energy Healing", "Traditional Diagnostics", "Sacred Rituals"],
    icon: Leaf,
    color: "bg-forest text-white",
    practitioners: 12,
    availability: "Available"
  },
  {
    id: "shaman",
    name: "healer.shaman",
    description: "healer.shamanDesc",
    specialties: ["Soul Retrieval", "Spiritual Cleansing", "Vision Quests", "Power Animal Work"],
    icon: Sun,
    color: "bg-amber-600 text-white",
    practitioners: 8,
    availability: "Limited"
  },
  {
    id: "ceremony-leader",
    name: "healer.ceremonyLeader",
    description: "healer.ceremonyLeaderDesc",
    specialties: ["Sweat Lodge", "Pipe Ceremony", "Healing Circles", "Moon Ceremonies"],
    icon: Calendar,
    color: "bg-purple-600 text-white",
    practitioners: 6,
    availability: "Available",
    videoUrl: "https://youtu.be/P4WubgKEP2Q?feature=shared"
  },
  {
    id: "ritual-specialist",
    name: "healer.ritualSpecialist",
    description: "healer.ritualSpecialistDesc",
    specialties: ["Purification Rituals", "Blessing Ceremonies", "Sacred Smudging", "Prayer Rituals"],
    icon: Heart,
    color: "bg-rose-600 text-white",
    practitioners: 10,
    availability: "Available"
  },
  {
    id: "meditation-guide",
    name: "healer.meditationGuide",
    description: "healer.meditationGuideDesc",
    specialties: ["Nature Meditation", "Walking Meditation", "Breathwork", "Mindful Awareness"],
    icon: Moon,
    color: "bg-indigo-600 text-white",
    practitioners: 15,
    availability: "Available"
  },
  {
    id: "medicine-person",
    name: "healer.medicinePerson",
    description: "healer.medicinePersonDesc",
    specialties: ["Herbal Medicine", "Plant Preparation", "Healing Protocols", "Wellness Counseling"],
    icon: Leaf,
    color: "bg-emerald-600 text-white",
    practitioners: 9,
    availability: "Available"
  },
  {
    id: "listener",
    name: "healer.listener",
    description: "healer.listenerDesc",
    specialties: ["Active Listening", "Emotional Support", "Life Guidance", "Conflict Resolution"],
    icon: Ear,
    color: "bg-teal-600 text-white",
    practitioners: 18,
    availability: "Available"
  },
  {
    id: "elder-wisdom",
    name: "healer.elderWisdom",
    description: "healer.elderWisdomDesc",
    specialties: ["Life Wisdom", "Cultural Teachings", "Ancestral Stories", "Traditional Values"],
    icon: BookOpen,
    color: "bg-orange-600 text-white",
    practitioners: 7,
    availability: "Limited"
  }
];

export default function Journey() {
  const [selectedHealer, setSelectedHealer] = useState<HealerCategory | null>(null);
  const { t } = useTranslation();

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        {/* RÜTZ Logo */}
        <div className="flex justify-center pb-6">
          <Logo size="lg" />
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-forest to-sage text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t('healer.title')}
              </h1>
              <p className="text-xl md:text-2xl text-cream max-w-3xl mx-auto leading-relaxed">
                {t('healer.subtitle')}
              </p>
              <div className="mt-8 flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-botanical-gold">{healerCategories.length}</div>
                  <div className="text-cream">{t('healer.types')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-botanical-gold">{healerCategories.reduce((sum, cat) => sum + cat.practitioners, 0)}+</div>
                  <div className="text-cream">{t('healer.practitioners')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-botanical-gold">24/7</div>
                  <div className="text-cream">{t('healer.support')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Healer Categories Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
                {t('healer.traditions')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('healer.traditionsDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healerCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-sage"
                    onClick={() => setSelectedHealer(category)}
                    data-testid={`healer-card-${category.id}`}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center relative`}>
                        <category.icon className="w-8 h-8" />
                        {category.videoUrl && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-forest">
                        {t(category.name)}
                        {category.videoUrl && (
                          <span className="ml-2 text-red-600 text-sm">📹</span>
                        )}
                      </CardTitle>
                      <div className="flex justify-center space-x-2">
                        <Badge variant={category.availability === "Available" ? "default" : "secondary"}>
                          {t(category.availability === "Available" ? "common.available" : "common.limited")}
                        </Badge>
                        <Badge variant="outline">
                          {category.practitioners} {t('healer.practitioners').toLowerCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm">
                        {t(category.description)}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-forest text-sm">{t('healer.specialties')}:</h4>
                        <div className="flex flex-wrap gap-1">
                          {category.specialties.slice(0, 2).map((specialty, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-cream text-sage px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                          {category.specialties.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{category.specialties.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-forest mb-6">
                {t('healer.readyTitle')}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('healer.readyDesc')}
              </p>
              <Button
                size="lg"
                className="bg-forest text-white hover:bg-sage px-8 py-4 text-lg"
                data-testid="start-healing-journey"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                {t('healer.startJourney')}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Healer Detail Modal */}
      <Dialog open={!!selectedHealer} onOpenChange={() => setSelectedHealer(null)}>
        <DialogContent className="max-w-2xl" data-testid="healer-detail-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-forest flex items-center">
              {selectedHealer && (
                <>
                  <div className={`w-12 h-12 ${selectedHealer.color} rounded-full mr-4 flex items-center justify-center`}>
                    <selectedHealer.icon className="w-6 h-6" />
                  </div>
                  {t(selectedHealer.name)}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedHealer && t(selectedHealer.description)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedHealer && (
            <div className="space-y-6">
              {/* Video Section for Ceremony Leader */}
              {selectedHealer.videoUrl && (
                <div>
                  <h3 className="font-semibold text-forest mb-3">{t('healer.ceremonyVideo')}</h3>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={selectedHealer.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('?feature=shared', '')}
                      title="Sacred Ceremony Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      data-testid="ceremony-video"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-forest mb-3">{t('healer.specialties')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHealer.specialties.map((specialty, idx) => (
                    <div
                      key={idx}
                      className="bg-cream text-sage px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-forest text-white rounded-lg">
                <div>
                  <div className="font-semibold">{t('healer.availablePractitioners')}</div>
                  <div className="text-botanical-gold text-2xl font-bold">{selectedHealer.practitioners}</div>
                </div>
                <div>
                  <div className="font-semibold">{t('healer.status')}</div>
                  <div className="text-botanical-gold text-lg">{t(selectedHealer.availability === "Available" ? "common.available" : "common.limited")}</div>
                </div>
              </div>

              <Button
                className="w-full bg-sage text-white hover:bg-forest"
                size="lg"
                data-testid="connect-with-healer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('healer.connectWith')} {t(selectedHealer.name)}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <CartSidebar />
    </div>
  );
}