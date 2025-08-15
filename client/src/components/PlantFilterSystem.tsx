import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Leaf, Package, FlaskConical, Beaker, Sparkles, Building2, Search, ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

interface FilterData {
  sectors: string[];
  plantMaterials: string[];
  productTypes: string[];
}

interface PlantGroupData {
  plantMaterial: string;
  totalProducts: number;
  sectors: Record<string, Product[]>;
}

// Plant material icons mapping
const getPlantIcon = (plantMaterial: string) => {
  switch (plantMaterial) {
    case "Chaga Mushroom":
      return "🍄";
    case "Turmeric":
      return "🌿";
    case "Ashwagandha":
      return "🌱";
    default:
      return "🌿";
  }
};

// Sector icons mapping
const getSectorIcon = (sector: string) => {
  switch (sector) {
    case "Nutraceuticals / Supplements":
      return <FlaskConical className="h-5 w-5" />;
    case "Functional Foods & Beverages":
      return <Package className="h-5 w-5" />;
    case "Cosmetics & Personal Care":
      return <Sparkles className="h-5 w-5" />;
    case "Biomedical / Pharma Leads":
      return <Beaker className="h-5 w-5" />;
    case "Industrial / Specialty":
      return <Building2 className="h-5 w-5" />;
    case "R&D / Enabling":
      return <Search className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

const PlantFilterSystem: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "plant-cycle">("grid");

  // Fetch filter options
  const { data: filterData, isLoading: filtersLoading } = useQuery<FilterData>({
    queryKey: ["/api/products/filters"],
  });

  // Fetch filtered products
  const queryParams = new URLSearchParams();
  if (selectedSector) queryParams.set('sector', selectedSector);
  if (selectedPlant) queryParams.set('plantMaterial', selectedPlant);
  if (selectedProductType) queryParams.set('productType', selectedProductType);
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { sector: selectedSector, plantMaterial: selectedPlant, productType: selectedProductType }],
    queryFn: async () => {
      const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  // Fetch plant-specific data for cycle view
  const { data: plantCycleData, isLoading: plantCycleLoading } = useQuery<PlantGroupData>({
    queryKey: [`/api/products/by-plant/${selectedPlant}`],
    enabled: !!selectedPlant && viewMode === "plant-cycle",
  });

  const clearFilters = () => {
    setSelectedPlant("");
    setSelectedSector("");
    setSelectedProductType("");
  };

  // Handle filter changes to avoid empty strings
  const handlePlantChange = (value: string) => {
    setSelectedPlant(value === "all" ? "" : value);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value === "all" ? "" : value);
  };

  const handleProductTypeChange = (value: string) => {
    setSelectedProductType(value === "all" ? "" : value);
  };

  const activeFiltersCount = [selectedPlant, selectedSector, selectedProductType].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-rutz-forest">Plant-Based Product System</h2>
        <p className="text-rutz-sage max-w-3xl mx-auto text-lg">
          Explore our comprehensive botanical extracts organized by plant raw materials across multiple sectors.
          From traditional supplements to cutting-edge biomedical applications.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => setViewMode("grid")}
          className="bg-rutz-forest hover:bg-rutz-forest/80"
          data-testid="button-view-grid"
        >
          <Package className="h-4 w-4 mr-2" />
          Product Grid
        </Button>
        <Button
          variant={viewMode === "plant-cycle" ? "default" : "outline"}
          onClick={() => setViewMode("plant-cycle")}
          className="bg-rutz-forest hover:bg-rutz-forest/80"
          data-testid="button-view-plant-cycle"
        >
          <Leaf className="h-4 w-4 mr-2" />
          Plant Life Cycle
        </Button>
      </div>

      {/* Filter Controls */}
      <Card className="border-rutz-gold/20">
        <CardHeader>
          <CardTitle className="text-rutz-forest flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter by Plant & Application
          </CardTitle>
          <CardDescription>
            Select plant materials and application sectors to explore our integrated product ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-rutz-forest">Plant Material</label>
              <Select value={selectedPlant || "all"} onValueChange={handlePlantChange}>
                <SelectTrigger data-testid="select-plant-material">
                  <SelectValue placeholder="Select plant material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="plant-option-all">All Plants</SelectItem>
                  {filterData?.plantMaterials.map((plant) => (
                    <SelectItem key={plant} value={plant} data-testid={`plant-option-${plant}`}>
                      {getPlantIcon(plant)} {plant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-rutz-forest">Application Sector</label>
              <Select value={selectedSector || "all"} onValueChange={handleSectorChange}>
                <SelectTrigger data-testid="select-sector">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="sector-option-all">All Sectors</SelectItem>
                  {filterData?.sectors.map((sector) => (
                    <SelectItem key={sector} value={sector} data-testid={`sector-option-${sector}`}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-rutz-forest">Product Type</label>
              <Select value={selectedProductType || "all"} onValueChange={handleProductTypeChange}>
                <SelectTrigger data-testid="select-product-type">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="product-type-option-all">All Types</SelectItem>
                  {filterData?.productTypes.map((type) => (
                    <SelectItem key={type} value={type} data-testid={`product-type-option-${type}`}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-rutz-sage">Active filters:</span>
              <Badge variant="secondary">{activeFiltersCount}</Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plant Life Cycle View */}
      {viewMode === "plant-cycle" && selectedPlant && (
        <div className="space-y-6">
          <Card className="border-rutz-gold/30 bg-gradient-to-r from-rutz-cream to-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-rutz-forest flex items-center justify-center gap-2">
                <span className="text-3xl">{getPlantIcon(selectedPlant)}</span>
                {selectedPlant} Product Ecosystem
              </CardTitle>
              <CardDescription className="text-lg">
                Complete product lifecycle from raw botanical material to end applications
              </CardDescription>
            </CardHeader>
            {plantCycleData && (
              <CardContent>
                <div className="text-center mb-6">
                  <Badge variant="outline" className="text-lg px-4 py-2 border-rutz-gold text-rutz-forest">
                    {plantCycleData.totalProducts} Total Products
                  </Badge>
                </div>
                
                <div className="space-y-8">
                  {Object.entries(plantCycleData.sectors).map(([sector, sectorProducts]) => (
                    <div key={sector} className="space-y-4">
                      <div className="flex items-center gap-3">
                        {getSectorIcon(sector)}
                        <h3 className="text-xl font-semibold text-rutz-forest">{sector}</h3>
                        <Badge variant="secondary">{sectorProducts.length} products</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8">
                        {sectorProducts.map((product) => (
                          <Card key={product.id} className="hover:shadow-md transition-shadow border-rutz-gold/20">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-rutz-forest line-clamp-2">{product.name}</h4>
                                <p className="text-sm text-rutz-sage line-clamp-2">{product.shortDescription}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-rutz-forest">${product.price}</span>
                                  <Button size="sm" className="bg-rutz-gold hover:bg-rutz-gold/80 text-rutz-forest" data-testid={`button-add-cart-${product.id}`}>
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {sector !== Object.keys(plantCycleData.sectors)[Object.keys(plantCycleData.sectors).length - 1] && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Product Grid View */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-rutz-forest">
              {products ? `${products.length} Products` : 'Products'}
            </h3>
            {selectedPlant && (
              <Badge variant="outline" className="border-rutz-gold text-rutz-forest">
                <span className="mr-1">{getPlantIcon(selectedPlant)}</span>
                {selectedPlant}
              </Badge>
            )}
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all border-rutz-gold/20 group">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{getPlantIcon(product.plantMaterial)}</span>
                        <Badge variant="outline" className="text-xs">{product.sector}</Badge>
                      </div>
                      <h4 className="font-semibold text-rutz-forest group-hover:text-rutz-gold transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-rutz-sage line-clamp-2">{product.shortDescription}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">{product.productType}</Badge>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-rutz-forest">${product.price}</span>
                        <Button 
                          size="sm" 
                          className="bg-rutz-gold hover:bg-rutz-gold/80 text-rutz-forest"
                          data-testid={`button-add-cart-${product.id}`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold text-rutz-forest mb-2">No products found</h3>
                <p className="text-rutz-sage mb-4">
                  Try adjusting your filters to discover more botanical extracts
                </p>
                <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters-empty">
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantFilterSystem;