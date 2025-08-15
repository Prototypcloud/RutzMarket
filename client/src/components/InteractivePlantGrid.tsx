import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Sparkles, Leaf, Play, Volume2 } from "lucide-react";

interface PlantProduct {
  id: string;
  name: string;
  sector: string;
  type: string;
  icon: string;
}

interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  origin: string;
  icon: string;
  image: string;
  description: string;
  traditionalUse: string;
  products: PlantProduct[];
  color: string;
  healerVideo?: {
    url: string;
    thumbnail: string;
    healerName: string;
    tribe: string;
    ceremonialContext: string;
    duration: string;
  };
}

const InteractivePlantGrid: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const indigenousCanadianPlants: PlantData[] = [
    {
      id: "chaga",
      name: "Chaga Mushroom",
      scientificName: "Inonotus obliquus",
      origin: "Canadian Boreal Forests",
      icon: "⚫",
      image: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=400&h=300&fit=crop",
      description: "Sacred medicine from birch trees, harvested by indigenous communities for immune system support and longevity.",
      traditionalUse: "Used by northern indigenous peoples as a warming tea for vitality during harsh winters.",
      color: "from-amber-600 to-orange-700",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456123",
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        healerName: "Elder Mary Sinclair",
        tribe: "Anishinaabe First Nation",
        ceremonialContext: "Traditional Chaga harvesting ceremony in boreal forest",
        duration: "3:42"
      },
      products: [
        { id: "chaga-powder", name: "Extract Powder", sector: "Nutraceuticals", type: "Supplement", icon: "💊" },
        { id: "chaga-coffee", name: "Mushroom Coffee", sector: "Functional Foods", type: "Beverage", icon: "☕" },
        { id: "chaga-serum", name: "Anti-aging Serum", sector: "Cosmetics", type: "Skincare", icon: "🧴" },
        { id: "chaga-tincture", name: "Liquid Extract", sector: "Nutraceuticals", type: "Tincture", icon: "🧪" },
        { id: "chaga-capsules", name: "Immune Capsules", sector: "Nutraceuticals", type: "Capsule", icon: "💊" },
        { id: "chaga-tea", name: "Herbal Tea Blend", sector: "Functional Foods", type: "Tea", icon: "🫖" },
        { id: "chaga-cream", name: "Healing Balm", sector: "Cosmetics", type: "Topical", icon: "🏺" },
        { id: "chaga-gummies", name: "Wellness Gummies", sector: "Functional Foods", type: "Edible", icon: "🟡" }
      ]
    },
    {
      id: "labrador-tea",
      name: "Labrador Tea",
      scientificName: "Rhododendron groenlandicum",
      origin: "Canadian Arctic Tundra",
      icon: "🌿",
      image: "https://images.unsplash.com/photo-1563827091-4b2a4b8f3e5b?w=400&h=300&fit=crop",
      description: "Traditional Inuit medicine for respiratory health and digestive wellness, growing in harsh northern conditions.",
      traditionalUse: "Brewed as tea by Inuit and First Nations for cold relief and ceremonial purposes.",
      color: "from-green-600 to-teal-700",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456124",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        healerName: "Elder James Kanguq",
        tribe: "Inuit Community of Nunavut",
        ceremonialContext: "Arctic tea ceremony for respiratory healing",
        duration: "4:15"
      },
      products: [
        { id: "lt-tea", name: "Traditional Tea", sector: "Functional Foods", type: "Tea", icon: "🫖" },
        { id: "lt-extract", name: "Respiratory Extract", sector: "Nutraceuticals", type: "Extract", icon: "🧪" },
        { id: "lt-salve", name: "Healing Salve", sector: "Cosmetics", type: "Topical", icon: "🏺" },
        { id: "lt-aromatherapy", name: "Essential Oil", sector: "Cosmetics", type: "Aromatherapy", icon: "🫙" },
        { id: "lt-capsules", name: "Wellness Capsules", sector: "Nutraceuticals", type: "Capsule", icon: "💊" },
        { id: "lt-honey", name: "Infused Honey", sector: "Functional Foods", type: "Sweetener", icon: "🍯" }
      ]
    },
    {
      id: "wild-rose",
      name: "Wild Rose Hips",
      scientificName: "Rosa acicularis",
      origin: "Canadian Prairies & Forests",
      icon: "🌹",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      description: "Vitamin C powerhouse traditionally used by Plains Cree and other First Nations for immune support and skin health.",
      traditionalUse: "Gathered by prairie nations as dried medicine for scurvy prevention and winter nutrition.",
      color: "from-rose-500 to-pink-600",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456125",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        healerName: "Elder Rose Beargrease",
        tribe: "Plains Cree Nation",
        ceremonialContext: "Wild rose gathering and preparation ceremony",
        duration: "5:28"
      },
      products: [
        { id: "rh-vitamin", name: "Vitamin C Complex", sector: "Nutraceuticals", type: "Supplement", icon: "💊" },
        { id: "rh-jam", name: "Rose Hip Jam", sector: "Functional Foods", type: "Preserve", icon: "🫙" },
        { id: "rh-oil", name: "Facial Oil", sector: "Cosmetics", type: "Skincare", icon: "🧴" },
        { id: "rh-syrup", name: "Immune Syrup", sector: "Functional Foods", type: "Syrup", icon: "🧴" },
        { id: "rh-soap", name: "Nourishing Soap", sector: "Cosmetics", type: "Cleansing", icon: "🧼" },
        { id: "rh-powder", name: "Superfood Powder", sector: "Nutraceuticals", type: "Powder", icon: "🥄" }
      ]
    },
    {
      id: "sweet-grass",
      name: "Sweet Grass",
      scientificName: "Hierochloe odorata",
      origin: "Canadian Plains & Wetlands",
      icon: "🌾",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      description: "Sacred smudging plant of Plains First Nations, used for purification ceremonies and aromatherapy.",
      traditionalUse: "Braided and burned in ceremonies for spiritual cleansing and to invite positive energy.",
      color: "from-yellow-500 to-amber-600",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456126",
        thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
        healerName: "Elder Joseph Crowfeather",
        tribe: "Lakota Nation",
        ceremonialContext: "Sacred sweetgrass braiding and smudging ceremony",
        duration: "6:12"
      },
      products: [
        { id: "sg-smudge", name: "Ceremonial Braids", sector: "Wellness", type: "Spiritual", icon: "🔥" },
        { id: "sg-incense", name: "Natural Incense", sector: "Aromatherapy", type: "Incense", icon: "🪔" },
        { id: "sg-spray", name: "Room Spray", sector: "Cosmetics", type: "Spray", icon: "🫧" },
        { id: "sg-oil", name: "Essential Oil", sector: "Cosmetics", type: "Aromatherapy", icon: "🫙" },
        { id: "sg-candle", name: "Scented Candle", sector: "Wellness", type: "Candle", icon: "🕯️" }
      ]
    },
    {
      id: "fireweed",
      name: "Fireweed",
      scientificName: "Chamaenerion angustifolium",
      origin: "Canadian Forests & Clearings",
      icon: "🌸",
      image: "https://images.unsplash.com/photo-1596436986888-0d24df17cc0a?w=400&h=300&fit=crop",
      description: "Resilient pioneer plant used by northern indigenous communities for digestive health and wound healing.",
      traditionalUse: "Young leaves used as potherb by Dene and Inuit peoples, flowers for tea and medicine.",
      color: "from-purple-500 to-pink-500",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456127",
        thumbnail: "https://images.unsplash.com/photo-1596436986888-0d24df17cc0a?w=400&h=300&fit=crop",
        healerName: "Elder Sarah Blackstone",
        tribe: "Dene Nation",
        ceremonialContext: "Fireweed harvesting and preparation in natural setting",
        duration: "4:55"
      },
      products: [
        { id: "fw-tea", name: "Digestive Tea", sector: "Functional Foods", type: "Tea", icon: "🫖" },
        { id: "fw-honey", name: "Wildflower Honey", sector: "Functional Foods", type: "Sweetener", icon: "🍯" },
        { id: "fw-balm", name: "Healing Balm", sector: "Cosmetics", type: "Topical", icon: "🏺" },
        { id: "fw-tincture", name: "Digestive Tincture", sector: "Nutraceuticals", type: "Extract", icon: "🧪" },
        { id: "fw-soap", name: "Gentle Soap", sector: "Cosmetics", type: "Cleansing", icon: "🧼" }
      ]
    },
    {
      id: "wild-mint",
      name: "Wild Mint",
      scientificName: "Mentha arvensis",
      origin: "Canadian Wetlands",
      icon: "🌿",
      image: "https://images.unsplash.com/photo-1628557044797-f21adf2d2e5c?w=400&h=300&fit=crop",
      description: "Cooling medicine used by woodland First Nations for digestive issues and respiratory congestion.",
      traditionalUse: "Chewed fresh or dried into tea by Ojibwe and Cree for stomach ailments and ceremonies.",
      color: "from-green-500 to-emerald-600",
      healerVideo: {
        url: "https://player.vimeo.com/video/789456128",
        thumbnail: "https://images.unsplash.com/photo-1628557044797-f21adf2d2e5c?w=400&h=300&fit=crop",
        healerName: "Elder Susan Migizi",
        tribe: "Ojibwe Nation",
        ceremonialContext: "Wild mint gathering and tea ceremony by the water",
        duration: "3:24"
      },
      products: [
        { id: "wm-tea", name: "Digestive Tea", sector: "Functional Foods", type: "Tea", icon: "🫖" },
        { id: "wm-oil", name: "Peppermint Oil", sector: "Cosmetics", type: "Essential Oil", icon: "🫙" },
        { id: "wm-balm", name: "Cooling Balm", sector: "Cosmetics", type: "Topical", icon: "🏺" },
        { id: "wm-gum", name: "Natural Gum", sector: "Functional Foods", type: "Oral Care", icon: "🦷" },
        { id: "wm-candy", name: "Throat Lozenges", sector: "Functional Foods", type: "Candy", icon: "🍬" }
      ]
    }
  ];

  const handlePlantClick = (plant: PlantData) => {
    if (selectedPlant?.id === plant.id) {
      setSelectedPlant(null);
    } else {
      setIsAnimating(true);
      setSelectedPlant(plant);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const closeModal = () => {
    setSelectedPlant(null);
    setIsVideoPlaying(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };



  return (
    <div className="relative">
      {/* Plant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indigenousCanadianPlants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="cursor-pointer"
            onClick={() => handlePlantClick(plant)}
            data-testid={`plant-card-${plant.id}`}
          >
            <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${
              selectedPlant?.id === plant.id 
                ? 'border-rutz-gold shadow-lg scale-105' 
                : 'border-rutz-gold/30 hover:border-rutz-gold/60'
            }`}>
              <CardContent className="p-0">
                <div className="relative">
                  {/* Plant Image */}
                  <div 
                    className={`h-48 bg-gradient-to-br ${plant.color} rounded-t-lg flex items-center justify-center text-6xl relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="relative z-10">{plant.icon}</span>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {plant.products.length} products
                      </Badge>
                    </div>
                    {selectedPlant?.id === plant.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-rutz-gold/20 flex items-center justify-center"
                      >
                        <Sparkles className="h-12 w-12 text-white animate-pulse" />
                      </motion.div>
                    )}
                  </div>

                  {/* Plant Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-rutz-forest text-lg">{plant.name}</h3>
                      <p className="text-rutz-sage text-sm italic">{plant.scientificName}</p>
                      <Badge variant="outline" className="border-rutz-gold text-rutz-forest text-xs mt-1">
                        {plant.origin}
                      </Badge>
                    </div>
                    
                    <p className="text-rutz-sage text-sm leading-relaxed line-clamp-3">
                      {plant.description}
                    </p>

                    <div className="pt-2 border-t border-rutz-gold/20">
                      <p className="text-xs text-rutz-sage/80 italic">
                        Traditional Use: {plant.traditionalUse}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-rutz-sage">
                        <Leaf className="h-3 w-3" />
                        <span>Indigenous Sourced</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-rutz-gold hover:text-rutz-forest"
                      >
                        {selectedPlant?.id === plant.id ? 'Close' : 'Explore'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orbital Product Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={closeModal}
                data-testid="close-plant-modal"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Central Plant */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${selectedPlant.color} text-6xl mb-4 shadow-xl`}
                >
                  {selectedPlant.icon}
                </motion.div>
                <h2 className="text-2xl font-bold text-rutz-forest">{selectedPlant.name}</h2>
                <p className="text-rutz-sage italic">{selectedPlant.scientificName}</p>
                <Badge variant="outline" className="border-rutz-gold text-rutz-forest mt-2">
                  {selectedPlant.origin}
                </Badge>
              </div>

              {/* Product Carousel */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-r from-transparent via-rutz-cream/10 to-transparent rounded-lg">
                <div className="absolute inset-0 flex items-center">
                  <motion.div
                    className="flex space-x-4"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{
                      duration: selectedPlant.products.length * 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ width: `${selectedPlant.products.length * 200}px` }}
                  >
                    {/* First set of products */}
                    {selectedPlant.products.map((product, index) => (
                      <motion.div
                        key={`first-${product.id}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        data-testid={`carousel-product-${product.id}`}
                      >
                        <Card className="w-40 h-32 shadow-lg border-2 border-rutz-gold/30 hover:border-rutz-gold bg-white/95 backdrop-blur-sm">
                          <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                            <div className="text-3xl mb-2">{product.icon}</div>
                            <div className="text-sm text-center font-medium text-rutz-forest line-clamp-2 mb-1">
                              {product.name}
                            </div>
                            <Badge variant="outline" className="text-xs border-rutz-gold/50 text-rutz-sage">
                              {product.sector}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {selectedPlant.products.map((product, index) => (
                      <motion.div
                        key={`second-${product.id}`}
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        <Card className="w-40 h-32 shadow-lg border-2 border-rutz-gold/30 hover:border-rutz-gold bg-white/95 backdrop-blur-sm">
                          <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                            <div className="text-3xl mb-2">{product.icon}</div>
                            <div className="text-sm text-center font-medium text-rutz-forest line-clamp-2 mb-1">
                              {product.name}
                            </div>
                            <Badge variant="outline" className="text-xs border-rutz-gold/50 text-rutz-sage">
                              {product.sector}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Gradient overlays for smooth fade effect */}
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              </div>

              {/* Indigenous Healer Video Section */}
              {selectedPlant.healerVideo && (
                <div className="mt-8 border-t border-rutz-gold/20 pt-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-rutz-forest mb-2 flex items-center justify-center gap-2">
                      <Volume2 className="h-5 w-5 text-rutz-gold" />
                      Traditional Healing Ceremony
                    </h3>
                    <p className="text-rutz-sage text-sm">
                      Learn from indigenous healers about traditional use and preparation
                    </p>
                  </div>

                  <div className="relative max-w-3xl mx-auto">
                    {!isVideoPlaying ? (
                      <div 
                        className="relative cursor-pointer group rounded-lg overflow-hidden"
                        onClick={toggleVideo}
                        data-testid="video-thumbnail"
                      >
                        <img 
                          src={selectedPlant.healerVideo.thumbnail}
                          alt={selectedPlant.healerVideo.ceremonialContext}
                          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-4 group-hover:bg-rutz-gold group-hover:text-white transition-all">
                              <Play className="h-8 w-8 ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                            <p className="font-medium text-sm mb-1">{selectedPlant.healerVideo.healerName}</p>
                            <p className="text-xs text-gray-200 mb-1">{selectedPlant.healerVideo.tribe}</p>
                            <p className="text-xs text-gray-300">{selectedPlant.healerVideo.ceremonialContext}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs bg-rutz-gold/80 px-2 py-1 rounded">
                                {selectedPlant.healerVideo.duration}
                              </span>
                              <span className="text-xs">Click to watch ceremony</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <iframe
                          src={`${selectedPlant.healerVideo.url}?autoplay=1&background=1`}
                          className="w-full h-64 md:h-80 rounded-lg"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={selectedPlant.healerVideo.ceremonialContext}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                          onClick={toggleVideo}
                          data-testid="close-video"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-rutz-sage/80 italic max-w-2xl mx-auto">
                      This ceremony demonstrates the traditional harvesting and preparation methods 
                      passed down through generations of indigenous knowledge keepers.
                    </p>
                  </div>
                </div>
              )}

              {/* Plant Description */}
              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-rutz-forest">Traditional Medicine</h3>
                    <p className="text-rutz-sage text-sm leading-relaxed">
                      {selectedPlant.traditionalUse}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-rutz-forest">Modern Applications</h3>
                    <p className="text-rutz-sage text-sm leading-relaxed">
                      {selectedPlant.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-rutz-gold/20">
                  {Array.from(new Set(selectedPlant.products.map(p => p.sector))).map((sector) => (
                    <Badge key={sector} variant="outline" className="border-rutz-gold text-rutz-forest">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractivePlantGrid;