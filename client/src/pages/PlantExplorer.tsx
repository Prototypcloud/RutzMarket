import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalIndigenousPlantExplorer from '@/components/GlobalIndigenousPlantExplorer';
import PlantFilterSystem from "@/components/PlantFilterSystem";
import InteractivePlantGrid from "@/components/InteractivePlantGrid";
import { Logo } from '@/components/ui/logo';

const PlantExplorer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rutz-cream via-white to-rutz-sage/10">
      {/* Header with RÜTZ logo and navigation */}
      <div className="bg-white border-b border-rutz-gold/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="logo-link">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl text-rutz-forest">RÜTZ</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/" data-testid="back-home">
                <Button variant="outline" size="sm" className="border-rutz-gold/30 text-rutz-forest hover:bg-rutz-gold/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-rutz-gold" />
            <h1 className="text-4xl font-bold text-rutz-forest">Plant Explorer</h1>
          </div>
          <p className="text-xl text-rutz-sage max-w-4xl mx-auto leading-relaxed">
            Discover the complete botanical ecosystem from indigenous knowledge to modern applications. 
            Explore traditional wisdom, interactive visualizations, and comprehensive plant databases.
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="global" className="flex items-center gap-2" data-testid="global-tab">
              <Globe className="h-4 w-4" />
              Global Indigenous Plants
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2" data-testid="interactive-tab">
              <Leaf className="h-4 w-4" />
              Interactive Plant Grid
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2" data-testid="catalog-tab">
              <div className="h-4 w-4 rounded border border-current" />
              Product Catalog
            </TabsTrigger>
          </TabsList>

          {/* Global Indigenous Plants Explorer */}
          <TabsContent value="global" className="mt-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-rutz-forest">Global Indigenous Plant Database</h2>
              <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
                Explore traditional botanical knowledge from Indigenous communities worldwide. 
                Filter by region, indigenous tribes, ceremonial uses, and more to discover 
                the rich heritage of plant medicine spanning 70+ plants from multiple continents.
              </p>
            </div>
            <GlobalIndigenousPlantExplorer />
          </TabsContent>

          {/* Interactive Plant Grid */}
          <TabsContent value="interactive" className="mt-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-rutz-forest">Indigenous Canadian Plants</h2>
              <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
                Click on any plant to discover the full range of products created from traditional indigenous knowledge. 
                Watch as products orbit around the plant, showcasing the complete transformation from raw material to modern applications.
              </p>
            </div>
            <InteractivePlantGrid />
          </TabsContent>

          {/* Product Catalog Filter */}
          <TabsContent value="catalog" className="mt-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-rutz-forest">Advanced Plant & Product Filtering</h2>
              <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
                Explore our complete product catalog with advanced filtering by plant material, application sector, and product type.
              </p>
            </div>
            <PlantFilterSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlantExplorer;