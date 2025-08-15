import React from "react";
import PlantFilterSystem from "@/components/PlantFilterSystem";

const PlantExplorer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rutz-cream via-white to-rutz-sage/10">
      <div className="container mx-auto px-4 py-8">
        <PlantFilterSystem />
      </div>
    </div>
  );
};

export default PlantExplorer;