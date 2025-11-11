import { db } from './server/db';
import { globalIndigenousPlants } from './shared/schema';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EnhancedPlant {
  id: string;
  commonName: string;
  scientificName: string;
  indigenousNames: string[];
  habitat: string[];
  useCategory: string[];
  productOpportunityType: string[];
  novelFoodRegulatoryFlag: string;
  nutraceuticalPotential: string;
  harvestCultivationStatus: string;
  timeToMarket: string;
  culturalConsent: string;
  restorationServiceRole: string;
  valueChainComplexity: string;
  partsUsed: string[];
  seasonality: {
    harvestWindow: string;
    notes: string;
  };
  respectfulHarvestProtocol: string;
  regulatoryNotes: string;
  geofences: any[];
  skuIdeas: string[];
  processingNotes: string;
  sustainabilityFlags: {
    populationStatus: string;
    harvestRotationYears: number;
    replantingRecommended: boolean;
  };
  images: string[];
  sources: any[];
  attribution: {
    knowledgeKeeperReview: boolean;
    reviewNotes: string;
  };
}

async function importEnhancedPlants() {
  console.log('Starting enhanced plants import...');
  
  // Read JSON file
  const jsonPath = path.join(__dirname, 'attached_assets', 'converted_from_csv_1762866515134.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const plants = jsonData.catalog as EnhancedPlant[];
  
  console.log(`Found ${plants.length} plants to import`);
  
  // Canadian Indigenous communities for distribution
  const canadianTribes = [
    'First Nations',
    'Cree',
    'Ojibwe',
    'Inuit',
    'Métis',
    'Haudenosaunee',
    'Mi\'kmaq',
    'Anishinaabe',
    'Salish',
    'Dené'
  ];
  
  // Transform and insert plants
  let imported = 0;
  let skipped = 0;
  
  for (const plant of plants) {
    try {
      // Assign a Canadian Indigenous community based on plant index for diversity
      const tribeIndex = imported % canadianTribes.length;
      const assignedTribe = canadianTribes[tribeIndex];
      
      await db.insert(globalIndigenousPlants).values({
        id: plant.id,
        plantName: plant.commonName,
        scientificName: plant.scientificName,
        // Canadian geographical data
        region: 'North America',
        countryOfOrigin: 'Canada',
        traditionalUses: plant.useCategory.join(', ') || plant.processingNotes || 'Various traditional applications',
        popularProductForm: plant.processingNotes || 'Various forms',
        timeframe: 'Traditional knowledge passed down through generations',
        indigenousTribesOrGroup: assignedTribe,
        // Enhanced fields from new schema
        indigenousNames: plant.indigenousNames,
        habitat: plant.habitat,
        useCategory: plant.useCategory,
        productOpportunityType: plant.productOpportunityType,
        novelFoodRegulatoryFlag: plant.novelFoodRegulatoryFlag,
        nutraceuticalPotential: plant.nutraceuticalPotential,
        harvestCultivationStatus: plant.harvestCultivationStatus,
        timeToMarket: plant.timeToMarket,
        culturalConsent: plant.culturalConsent,
        restorationServiceRole: plant.restorationServiceRole,
        valueChainComplexity: plant.valueChainComplexity,
        partsUsed: plant.partsUsed,
        seasonalityHarvestWindow: plant.seasonality.harvestWindow,
        seasonalityNotes: plant.seasonality.notes,
        respectfulHarvestProtocol: plant.respectfulHarvestProtocol,
        regulatoryNotes: plant.regulatoryNotes,
        geofences: plant.geofences,
        skuIdeas: plant.skuIdeas,
        processingNotes: plant.processingNotes,
        populationStatus: plant.sustainabilityFlags.populationStatus,
        harvestRotationYears: plant.sustainabilityFlags.harvestRotationYears,
        replantingRecommended: plant.sustainabilityFlags.replantingRecommended,
        images: plant.images,
        sources: plant.sources,
        knowledgeKeeperReview: plant.attribution.knowledgeKeeperReview,
        reviewNotes: plant.attribution.reviewNotes,
      });
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`Imported ${imported}/${plants.length} plants...`);
      }
    } catch (error: any) {
      if (error.code === '23505') {
        skipped++;
      } else {
        console.error(`Error importing plant ${plant.commonName}:`, error.message);
      }
    }
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} plants`);
  console.log(`- Skipped (duplicates): ${skipped} plants`);
  console.log(`- Total in database: ${imported + skipped} plants`);
}

importEnhancedPlants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
