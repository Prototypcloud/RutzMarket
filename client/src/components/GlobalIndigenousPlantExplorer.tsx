import React, { useState, useMemo } from 'react';
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
}

const GlobalIndigenousPlantExplorer: React.FC = () => {
  const [filters, setFilters] = useState<PlantFilters>({
    searchTerm: '',
    region: '',
    country: '',
    tribe: '',
    productForm: '',
    ceremonialUse: false,
    veterinaryUse: false,
  });
  
  const [selectedPlant, setSelectedPlant] = useState<GlobalIndigenousPlant | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: plants = [], isLoading } = useQuery<GlobalIndigenousPlant[]>({
    queryKey: ['/api/global-indigenous-plants'],
  });

  // Extract unique filter options from data
  const filterOptions = useMemo(() => {
    const regionSet = new Set(plants.map(p => p.region));
    const countrySet = new Set(plants.map(p => p.countryOfOrigin));
    const tribeSet = new Set(plants.flatMap(p => 
      p.indigenousTribesOrGroup.split(',').map(t => t.trim())
    ));
    const productFormSet = new Set(plants.map(p => p.popularProductForm));
    
    const regions = Array.from(regionSet);
    const countries = Array.from(countrySet);
    const tribes = Array.from(tribeSet);
    const productForms = Array.from(productFormSet);
    
    return { regions, countries, tribes, productForms };
  }, [plants]);

  // Filter plants based on current filters
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = !filters.searchTerm || 
        plant.plantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        plant.traditionalUses.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesRegion = !filters.region || plant.region === filters.region;
      const matchesCountry = !filters.country || plant.countryOfOrigin.includes(filters.country);
      const matchesTribe = !filters.tribe || plant.indigenousTribesOrGroup.includes(filters.tribe);
      const matchesProductForm = !filters.productForm || plant.popularProductForm.includes(filters.productForm);
      const matchesCeremonial = !filters.ceremonialUse || Boolean(plant.associatedCeremony);
      const matchesVeterinary = !filters.veterinaryUse || Boolean(plant.veterinaryUse);

      return matchesSearch && matchesRegion && matchesCountry && matchesTribe && 
             matchesProductForm && matchesCeremonial && matchesVeterinary;
    });
  }, [plants, filters]);

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      region: '',
      country: '',
      tribe: '',
      productForm: '',
      ceremonialUse: false,
      veterinaryUse: false,
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
        className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-rutz-gold/20 hover:border-rutz-gold/40"
        onClick={() => setSelectedPlant(plant)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-rutz-forest mb-1 line-clamp-2">
                {plant.plantName}
              </CardTitle>
              <CardDescription className="text-sm italic text-rutz-sage">
                {plant.scientificName}
              </CardDescription>
            </div>
            <Leaf className="h-5 w-5 text-rutz-gold flex-shrink-0 ml-2" />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className="text-xs bg-rutz-gold/10 text-rutz-forest">
              {plant.region}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rutz-sage" />
              <span className="text-rutz-sage line-clamp-1">{plant.countryOfOrigin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-rutz-sage" />
              <span className="text-rutz-sage line-clamp-1">{plant.indigenousTribesOrGroup}</span>
            </div>
            {plant.associatedCeremony && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rutz-gold" />
                <span className="text-rutz-gold text-xs">Ceremonial Use</span>
              </div>
            )}
          </div>
          <p className="text-sm text-rutz-sage mt-3 line-clamp-2">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rutz-gold mx-auto"></div>
          <p className="text-rutz-sage">Loading Global Indigenous Plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-rutz-gold" />
          <h2 className="text-3xl font-bold text-rutz-forest">Global Indigenous Plant Explorer</h2>
        </div>
        <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
          Discover traditional botanical knowledge from Indigenous communities worldwide. 
          Filter by region, indigenous tribes, ceremonial uses, and more to explore 
          the rich heritage of plant medicine.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-rutz-sage">
          <span>{plants.length} total plants</span>
          <span>•</span>
          <span>{filteredPlants.length} matching filters</span>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="bg-white rounded-lg border border-rutz-gold/20 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-rutz-gold" />
          <h3 className="text-lg font-semibold text-rutz-forest">Filter Plants</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="ml-auto"
            data-testid="reset-filters"
          >
            Reset All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-rutz-sage" />
              <Input
                placeholder="Plant name, uses..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-9"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Region</label>
            <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
              <SelectTrigger data-testid="region-filter">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {filterOptions.regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Country</label>
            <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}>
              <SelectTrigger data-testid="country-filter">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {filterOptions.countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Indigenous Tribes Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Indigenous Group</label>
            <Select value={filters.tribe} onValueChange={(value) => setFilters(prev => ({ ...prev, tribe: value }))}>
              <SelectTrigger data-testid="tribe-filter">
                <SelectValue placeholder="All Tribes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Indigenous Groups</SelectItem>
                {filterOptions.tribes.map(tribe => (
                  <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rutz-forest">Product Form</label>
            <Select value={filters.productForm} onValueChange={(value) => setFilters(prev => ({ ...prev, productForm: value }))}>
              <SelectTrigger data-testid="product-form-filter">
                <SelectValue placeholder="All Product Forms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Product Forms</SelectItem>
                {filterOptions.productForms.map(form => (
                  <SelectItem key={form} value={form}>{form}</SelectItem>
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
        {filteredPlants.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-rutz-sage/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-rutz-forest mb-2">No plants found</h3>
            <p className="text-rutz-sage">Try adjusting your filters to see more results.</p>
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

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-rutz-forest mb-2">Traditional Uses</h4>
                    <p className="text-sm text-rutz-sage">{selectedPlant.traditionalUses}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-rutz-forest mb-2">Popular Product Forms</h4>
                    <p className="text-sm text-rutz-sage">{selectedPlant.popularProductForm}</p>
                  </div>

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