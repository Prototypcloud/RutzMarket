import React from "react";
import PlantFilterSystem from "@/components/PlantFilterSystem";
import InteractivePlantGrid from "@/components/InteractivePlantGrid";

const PlantExplorer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rutz-cream via-white to-rutz-forest/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-rutz-forest">Plant Explorer</h1>
          <p className="text-xl text-rutz-sage max-w-4xl mx-auto leading-relaxed">
            Discover how single plant raw materials transform into complete product ecosystems. 
            Interactive visualization shows the full botanical potential from indigenous knowledge to modern applications.
          </p>
        </div>

        {/* Interactive Plant Grid */}
        <div className="mb-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-rutz-forest">Indigenous Canadian Plants</h2>
            <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
              Click on any plant to discover the full range of products created from traditional indigenous knowledge. 
              Watch as products orbit around the plant, showcasing the complete transformation from raw material to modern applications.
            </p>
          </div>
          <InteractivePlantGrid />
        </div>

        {/* Plant Filter System */}
        <div className="border-t border-rutz-gold/20 pt-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-rutz-forest">Advanced Plant & Product Filtering</h2>
            <p className="text-rutz-sage max-w-4xl mx-auto leading-relaxed">
              Explore our complete catalog with advanced filtering by plant material, application sector, and product type.
            </p>
          </div>
          <PlantFilterSystem />
        </div>
      </div>
    </div>
  );
};

export default PlantExplorer;