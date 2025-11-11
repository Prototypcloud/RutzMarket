import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, Leaf, Users, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface PlantExplorerContent {
  meta: {
    version: string;
    updated_at_iso: string;
    project: string;
    description: string;
  };
  hero: {
    title: string;
    headline: string;
    subheadline: string;
    ctas: Array<{
      label: string;
      href: string;
      priority: string;
    }>;
  };
  intro: {
    headline: string;
    body: string[];
  };
  interactive_layer: {
    headline: string;
    subheadline: string;
    body: string[];
    micro_stats_line: string;
  };
  features: Array<{
    title: string;
    text: string;
    icon: string;
  }>;
  stats: {
    total_plants: number;
    cultural_regions: number;
    healing_traditions_over: number;
  };
  microcopy: {
    filters_hint: string;
    search_placeholder: string;
    empty_state_title: string;
    empty_state_body: string;
  };
}

interface GlobalIndigenousPlant {
  id: string;
  plantName: string;
  scientificName: string;
  region: string;
  countryOfOrigin: string;
  traditionalUses: string;
  popularProductForm: string;
  timeframe: string;
  associatedCeremony?: string;
  veterinaryUse?: string;
  indigenousTribesOrGroup: string;
  // Enhanced fields
  indigenousNames?: string[];
  habitat?: string[];
  useCategory?: string[];
  productOpportunityType?: string[];
  novelFoodRegulatoryFlag?: string;
  nutraceuticalPotential?: string;
  harvestCultivationStatus?: string;
  timeToMarket?: string;
  culturalConsent?: string;
  restorationServiceRole?: string;
  valueChainComplexity?: string;
  partsUsed?: string[];
  seasonalityHarvestWindow?: string;
  seasonalityNotes?: string;
  respectfulHarvestProtocol?: string;
  regulatoryNotes?: string;
  processingNotes?: string;
  populationStatus?: string;
  harvestRotationYears?: number;
  replantingRecommended?: boolean;
  knowledgeKeeperReview?: boolean;
  reviewNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlantFilters {
  searchTerm: string;
  region: string;
  country: string;
  tribe: string;
  productForm: string;
  ceremonialUse: boolean;
  veterinaryUse: boolean;
  useCategory: string;
  regulatoryFlag: string;
  cultivationStatus: string;
  timeToMarket: string;
}

const GlobalIndigenousPlantExplorer: React.FC = () => {
  const [filters, setFilters] = useState<PlantFilters>({
    searchTerm: '',
    region: 'all',
    country: 'all',
    tribe: 'all',
    productForm: 'all',
    ceremonialUse: false,
    veterinaryUse: false,
    useCategory: 'all',
    regulatoryFlag: 'all',
    cultivationStatus: 'all',
    timeToMarket: 'all',
  });
  
  const [selectedPlant, setSelectedPlant] = useState<GlobalIndigenousPlant | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load plants data
  const { data: plants = [], isLoading, error } = useQuery<GlobalIndigenousPlant[]>({
    queryKey: ['/api/global-indigenous-plants'],
  });

  // Load dynamic content
  const { data: content } = useQuery<PlantExplorerContent>({
    queryKey: ['plant-explorer-content'],
    queryFn: async () => {
      const response = await fetch('/plant_explorer_content.json');
      if (!response.ok) throw new Error('Failed to load content');
      return response.json();
    },
  });

  // Reset tribe filter when country changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, tribe: 'all' }));
  }, [filters.country]);

  // Debug logging
  console.log('Plant Explorer Debug:', { 
    plantsCount: plants?.length, 
    isLoading, 
    error: error?.message,
    filteredCount: plants?.filter(plant => {
      const matchesSearch = !filters.searchTerm || 
        plant.plantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.traditionalUses.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesRegion = filters.region === 'all' || plant.region === filters.region;
      const matchesCountry = filters.country === 'all' || plant.countryOfOrigin.includes(filters.country);
      const matchesTribe = filters.tribe === 'all' || plant.indigenousTribesOrGroup.includes(filters.tribe);
      const matchesProductForm = filters.productForm === 'all' || plant.popularProductForm.includes(filters.productForm);
      const matchesCeremonial = !filters.ceremonialUse || Boolean(plant.associatedCeremony);
      const matchesVeterinary = !filters.veterinaryUse || Boolean(plant.veterinaryUse);

      return matchesSearch && matchesRegion && matchesCountry && matchesTribe && 
             matchesProductForm && matchesCeremonial && matchesVeterinary;
    }).length
  });

  // Extract unique filter options from data
  const filterOptions = useMemo(() => {
    const regionSet = new Set(plants.map(p => p.region));
    const countrySet = new Set(plants.flatMap(p => 
      p.countryOfOrigin.split(',').map(c => c.trim())
    ));
    
    // Filter plants by selected country for tribe options
    const plantsForTribes = filters.country === 'all' 
      ? plants 
      : plants.filter(p => p.countryOfOrigin.includes(filters.country));
    
    const tribeSet = new Set(plantsForTribes.flatMap(p => 
      p.indigenousTribesOrGroup.split(',').map(t => t.trim())
    ));
    const productFormSet = new Set(plants.map(p => p.popularProductForm));
    
    // Enhanced filter options
    const useCategorySet = new Set(plants.flatMap(p => 
      p.useCategory && p.useCategory.length > 0 ? p.useCategory : []
    ));
    const regulatoryFlagSet = new Set(plants
      .map(p => p.novelFoodRegulatoryFlag)
      .filter(Boolean)
    );
    const cultivationStatusSet = new Set(plants
      .map(p => p.harvestCultivationStatus)
      .filter(Boolean)
    );
    const timeToMarketSet = new Set(plants
      .map(p => p.timeToMarket)
      .filter(Boolean)
    );
    
    const regions = Array.from(regionSet).sort();
    const countries = Array.from(countrySet).sort();
    const tribes = Array.from(tribeSet).sort();
    const productForms = Array.from(productFormSet).sort();
    const useCategories = Array.from(useCategorySet).sort();
    const regulatoryFlags = Array.from(regulatoryFlagSet).sort();
    const cultivationStatuses = Array.from(cultivationStatusSet).sort();
    const timeToMarkets = Array.from(timeToMarketSet).sort();
    
    return { 
      regions, countries, tribes, productForms, 
      useCategories, regulatoryFlags, cultivationStatuses, timeToMarkets 
    };
  }, [plants, filters.country]);

  // Filter plants based on current filters
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = !filters.searchTerm || 
        plant.plantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.traditionalUses.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesRegion = filters.region === 'all' || plant.region === filters.region;
      const matchesCountry = filters.country === 'all' || plant.countryOfOrigin.includes(filters.country);
      const matchesTribe = filters.tribe === 'all' || plant.indigenousTribesOrGroup.includes(filters.tribe);
      const matchesProductForm = filters.productForm === 'all' || plant.popularProductForm.includes(filters.productForm);
      const matchesCeremonial = !filters.ceremonialUse || Boolean(plant.associatedCeremony);
      const matchesVeterinary = !filters.veterinaryUse || Boolean(plant.veterinaryUse);
      
      // Enhanced filters
      const matchesUseCategory = filters.useCategory === 'all' || 
        (plant.useCategory && plant.useCategory.includes(filters.useCategory));
      const matchesRegulatory = filters.regulatoryFlag === 'all' || 
        plant.novelFoodRegulatoryFlag === filters.regulatoryFlag;
      const matchesCultivation = filters.cultivationStatus === 'all' || 
        plant.harvestCultivationStatus === filters.cultivationStatus;
      const matchesTimeToMarket = filters.timeToMarket === 'all' || 
        plant.timeToMarket === filters.timeToMarket;

      return matchesSearch && matchesRegion && matchesCountry && matchesTribe && 
             matchesProductForm && matchesCeremonial && matchesVeterinary &&
             matchesUseCategory && matchesRegulatory && matchesCultivation && matchesTimeToMarket;
    });
  }, [plants, filters]);

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      region: 'all',
      country: 'all',
      tribe: 'all',
      productForm: 'all',
      ceremonialUse: false,
      veterinaryUse: false,
      useCategory: 'all',
      regulatoryFlag: 'all',
      cultivationStatus: 'all',
      timeToMarket: 'all',
    });
  };

  const PlantCard = ({ plant }: { plant: GlobalIndigenousPlant }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      data-testid={`plant-card-${plant.id}`}
    >
      <Card 
        className="h-full cursor-pointer bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300 hover:bg-gray-50"
        onClick={() => setSelectedPlant(plant)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900 mb-1 line-clamp-2 font-semibold">
                {plant.plantName}
              </CardTitle>
              <CardDescription className="text-sm italic text-gray-600 font-sans">
                {plant.scientificName}
              </CardDescription>
            </div>
            <Leaf className="h-5 w-5 text-amber-600 flex-shrink-0 ml-2" />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
              {plant.region}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 line-clamp-1 font-medium">{plant.countryOfOrigin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 line-clamp-1 font-medium">{plant.indigenousTribesOrGroup}</span>
            </div>
            {plant.associatedCeremony && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">Ceremonial Use</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {plant.traditionalUses}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading Global Indigenous Plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Hero Section - Dynamic Content */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {content?.hero.title || 'Plant Explorer'}
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-rutz-forest max-w-4xl mx-auto">
          {content?.hero.headline || "Discover the world's living library of plants"}
        </h2>
        <p className="text-gray-600 max-w-4xl mx-auto font-medium">
          {content?.hero.subheadline || "From Indigenous knowledge to modern science - trace the botanical stories that shaped medicine, ceremony, and culture."}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-medium">
          <span className="bg-green-100 px-2 py-1 rounded-md text-green-800">{plants.length} total plants</span>
          <span>•</span>
          <span className="bg-amber-100 px-2 py-1 rounded-md text-amber-800">{filteredPlants.length} matching filters</span>
        </div>
        <p className="text-sm text-rutz-sage italic">
          {content?.interactive_layer.micro_stats_line || `${plants.length} total plants • 10 cultural regions • 70+ healing traditions`}
        </p>
      </motion.div>

      {/* Intro Section - Dynamic Content */}
      {content?.intro && (
        <motion.div
          className="bg-gradient-to-r from-green-50 to-amber-50 rounded-lg p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-2xl font-semibold text-rutz-forest mb-3">
            {content.intro.headline}
          </h3>
          <div className="space-y-3 text-gray-700">
            {content.intro.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters Section */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Plants</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="ml-auto hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800"
            data-testid="reset-filters"
          >
            Reset All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-high-contrast">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-green" />
              <Input
                placeholder={content?.microcopy.search_placeholder || "Search plants, uses, or communities..."}
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-9 focus-enhanced border-border focus:border-earth-green"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-high-contrast">Region</label>
            <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
              <SelectTrigger data-testid="region-filter" className="focus-enhanced border-border focus:border-earth-green">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value="all">All Regions</SelectItem>
                {filterOptions.regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-high-contrast">Country</label>
            <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}>
              <SelectTrigger data-testid="country-filter" className="focus-enhanced border-border focus:border-earth-green">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value="all">All Countries</SelectItem>
                {filterOptions.countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Indigenous Tribes Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-high-contrast">Indigenous Tribe</label>
            <Select value={filters.tribe} onValueChange={(value) => setFilters(prev => ({ ...prev, tribe: value }))}>
              <SelectTrigger data-testid="tribe-filter" className="focus-enhanced border-border focus:border-earth-green">
                <SelectValue placeholder="All Tribes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Indigenous Groups</SelectItem>
                {filterOptions.tribes.map(tribe => (
                  <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Product Form</label>
            <Select value={filters.productForm} onValueChange={(value) => setFilters(prev => ({ ...prev, productForm: value }))}>
              <SelectTrigger data-testid="product-form-filter">
                <SelectValue placeholder="All Product Forms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Product Forms</SelectItem>
                {filterOptions.productForms.map(form => (
                  <SelectItem key={form} value={form}>{form}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Use Category</label>
            <Select value={filters.useCategory} onValueChange={(value) => setFilters(prev => ({ ...prev, useCategory: value }))}>
              <SelectTrigger data-testid="use-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterOptions.useCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Regulatory Status</label>
            <Select value={filters.regulatoryFlag} onValueChange={(value) => setFilters(prev => ({ ...prev, regulatoryFlag: value }))}>
              <SelectTrigger data-testid="regulatory-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.regulatoryFlags.map(flag => (
                  <SelectItem key={flag} value={flag || ''}>{flag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Harvest Status</label>
            <Select value={filters.cultivationStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, cultivationStatus: value }))}>
              <SelectTrigger data-testid="cultivation-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.cultivationStatuses.map(status => (
                  <SelectItem key={status} value={status || ''}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Time to Market</label>
            <Select value={filters.timeToMarket} onValueChange={(value) => setFilters(prev => ({ ...prev, timeToMarket: value }))}>
              <SelectTrigger data-testid="time-to-market-filter">
                <SelectValue placeholder="All Timeframes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timeframes</SelectItem>
                {filterOptions.timeToMarkets.map(time => (
                  <SelectItem key={time} value={time || ''}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.ceremonialUse}
                onChange={(e) => setFilters(prev => ({ ...prev, ceremonialUse: e.target.checked }))}
                className="rounded border-rutz-gold/30 text-rutz-gold focus:ring-rutz-gold"
                data-testid="ceremonial-filter"
              />
              <span className="text-sm text-rutz-forest">Ceremonial Use</span>
            </label>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.veterinaryUse}
                onChange={(e) => setFilters(prev => ({ ...prev, veterinaryUse: e.target.checked }))}
                className="rounded border-rutz-gold/30 text-rutz-gold focus:ring-rutz-gold"
                data-testid="veterinary-filter"
              />
              <span className="text-sm text-rutz-forest">Veterinary Use</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {error ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-red-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Plants</h3>
            <p className="text-red-500">Failed to load plant data: {error.message}</p>
          </div>
        ) : filteredPlants.length === 0 && plants.length > 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-rutz-sage/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-rutz-forest mb-2">
              {content?.microcopy.empty_state_title || "No matches yet"}
            </h3>
            <p className="text-rutz-sage">
              {content?.microcopy.empty_state_body || "Try removing a filter or broadening your search terms."}
            </p>
            <Button onClick={resetFilters} className="mt-4">Reset Filters</Button>
          </div>
        ) : filteredPlants.length === 0 && plants.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-rutz-sage/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-rutz-forest mb-2">No plants available</h3>
            <p className="text-rutz-sage">The plant database appears to be empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPlants.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-rutz-gold/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-rutz-forest">{selectedPlant.plantName}</h3>
                    <p className="text-rutz-sage italic">{selectedPlant.scientificName}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedPlant(null)}
                    data-testid="close-modal"
                  >
                    ×
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="p-6 space-y-4">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="commercial">Commercial</TabsTrigger>
                      <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Origin</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.region}</p>
                          <p className="text-sm text-rutz-sage">{selectedPlant.countryOfOrigin}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Indigenous Groups</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.indigenousTribesOrGroup}</p>
                        </div>
                      </div>

                      {selectedPlant.indigenousNames && selectedPlant.indigenousNames.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Indigenous Names</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlant.indigenousNames.map((name, i) => (
                              <Badge key={i} variant="outline" className="bg-amber-50">{name}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPlant.useCategory && selectedPlant.useCategory.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Use Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlant.useCategory.map((cat, i) => (
                              <Badge key={i} className="bg-green-100 text-green-800">{cat}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-rutz-forest mb-2">Traditional Uses</h4>
                        <p className="text-sm text-rutz-sage">{selectedPlant.traditionalUses}</p>
                      </div>

                      {selectedPlant.partsUsed && selectedPlant.partsUsed.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Parts Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlant.partsUsed.map((part, i) => (
                              <Badge key={i} variant="secondary">{part}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPlant.associatedCeremony && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Associated Ceremonies</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.associatedCeremony}</p>
                        </div>
                      )}

                      {selectedPlant.veterinaryUse && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Veterinary Applications</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.veterinaryUse}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="commercial" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPlant.novelFoodRegulatoryFlag && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Regulatory Status</h4>
                            <Badge className="bg-blue-100 text-blue-800">{selectedPlant.novelFoodRegulatoryFlag}</Badge>
                          </div>
                        )}
                        
                        {selectedPlant.nutraceuticalPotential && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Nutraceutical Potential</h4>
                            <Badge className="bg-purple-100 text-purple-800">{selectedPlant.nutraceuticalPotential}</Badge>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {selectedPlant.timeToMarket && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Time to Market</h4>
                            <p className="text-sm text-rutz-sage">{selectedPlant.timeToMarket}</p>
                          </div>
                        )}
                        
                        {selectedPlant.valueChainComplexity && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Value Chain Complexity</h4>
                            <Badge variant="outline">{selectedPlant.valueChainComplexity}</Badge>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-rutz-forest mb-2">Product Forms</h4>
                        <p className="text-sm text-rutz-sage">{selectedPlant.popularProductForm}</p>
                      </div>

                      {selectedPlant.processingNotes && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Processing Notes</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.processingNotes}</p>
                        </div>
                      )}

                      {selectedPlant.regulatoryNotes && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Regulatory Notes</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.regulatoryNotes}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="sustainability" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPlant.harvestCultivationStatus && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Harvest Status</h4>
                            <Badge className="bg-green-100 text-green-800">{selectedPlant.harvestCultivationStatus}</Badge>
                          </div>
                        )}
                        
                        {selectedPlant.culturalConsent && (
                          <div>
                            <h4 className="font-semibold text-rutz-forest mb-2">Cultural Consent</h4>
                            <Badge className="bg-amber-100 text-amber-800">{selectedPlant.culturalConsent}</Badge>
                          </div>
                        )}
                      </div>

                      {selectedPlant.populationStatus && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Population Status</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.populationStatus}</p>
                        </div>
                      )}

                      {selectedPlant.harvestRotationYears !== undefined && selectedPlant.harvestRotationYears > 0 && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Harvest Rotation</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.harvestRotationYears} years</p>
                        </div>
                      )}

                      {selectedPlant.replantingRecommended && (
                        <div>
                          <Badge className="bg-green-100 text-green-800">Replanting Recommended</Badge>
                        </div>
                      )}

                      {selectedPlant.respectfulHarvestProtocol && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Respectful Harvest Protocol</h4>
                          <p className="text-sm text-rutz-sage">{selectedPlant.respectfulHarvestProtocol}</p>
                        </div>
                      )}

                      {selectedPlant.restorationServiceRole && (
                        <div>
                          <h4 className="font-semibold text-rutz-forest mb-2">Restoration Service Role</h4>
                          <Badge variant="secondary">{selectedPlant.restorationServiceRole}</Badge>
                        </div>
                      )}

                      {selectedPlant.knowledgeKeeperReview && (
                        <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
                          <p className="text-sm text-amber-800 font-medium">✓ Reviewed by Knowledge Keeper</p>
                          {selectedPlant.reviewNotes && (
                            <p className="text-xs text-amber-700 mt-1">{selectedPlant.reviewNotes}</p>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalIndigenousPlantExplorer;