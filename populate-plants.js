// Script to populate global indigenous plants with complete CSV data
const { DatabaseStorage } = require('./server/databaseStorage.js');

async function populatePlants() {
  const storage = new DatabaseStorage();
  
  const globalPlantsData = [
    {
      plantName: "Echinacea",
      scientificName: "Echinacea purpurea",
      region: "North America",
      countryOfOrigin: "United States, Canada",
      indigenousTribesOrGroup: "Plains Tribes (Lakota, Dakota, Omaha)",
      traditionalUses: "Immune boosting, treating colds, flu, and infections",
      popularProductForm: "Nutraceuticals, liquid tonics",
      timeframe: "Traditional knowledge passed down through generations",
      associatedCeremony: "Healing ceremonies, especially for immune system support",
      veterinaryUse: "Yes - Immune support, respiratory infections in horses and dogs",
      sustainabilityNotes: "Wild-crafted with sustainable harvesting practices",
      researchStatus: "Extensively studied for immune-modulating properties"
    },
    {
      plantName: "Yarrow",
      scientificName: "Achillea millefolium",
      region: "North America",
      countryOfOrigin: "United States, Canada",
      indigenousTribesOrGroup: "Numerous Tribes (Blackfoot, Cherokee, Iroquois)",
      traditionalUses: "Anti-inflammatory, pain relief, treating wounds, fevers, digestive issues",
      popularProductForm: "Essential oils, herbal teas",
      timeframe: "Traditional knowledge passed down through generations",
      associatedCeremony: "Used in sweat lodge ceremonies for purification and healing",
      veterinaryUse: "Yes - Wound care, anti-inflammatory for various animals",
      sustainabilityNotes: "Abundant wild herb, sustainably wildcrafted",
      researchStatus: "Traditional wound healing properties validated by research"
    },
    {
      plantName: "Sweetgrass",
      scientificName: "Hierochloe odorata",
      region: "North America",
      countryOfOrigin: "United States, Canada",
      indigenousTribesOrGroup: "Plains Tribes (Lakota, Dakota, Blackfoot)",
      traditionalUses: "Used in purification rituals and to treat colds and sore throats",
      popularProductForm: "Essential oils, smudging sticks",
      timeframe: "Traditional knowledge passed down through generations",
      associatedCeremony: "Smudging ceremonies for purification and to invite positive energy",
      veterinaryUse: null,
      sustainabilityNotes: "Wild-harvested with traditional protocols ensuring regeneration",
      researchStatus: "Sacred plant with documented aromatic compounds"
    },
    {
      plantName: "White Sage",
      scientificName: "Salvia apiana",
      region: "North America",
      countryOfOrigin: "United States (California)",
      indigenousTribesOrGroup: "Chumash, Cahuilla, Kumeyaay",
      traditionalUses: "Purification, treating respiratory issues",
      popularProductForm: "Smudging sticks, essential oils",
      timeframe: "Traditional knowledge passed down through generations",
      associatedCeremony: "Smudging ceremonies for cleansing and protection",
      veterinaryUse: null,
      sustainabilityNotes: "Protected native plant, cultivated sustainably to preserve wild populations",
      researchStatus: "Antimicrobial and aromatic properties studied"
    },
    {
      plantName: "Willow Bark",
      scientificName: "Salix spp.",
      region: "North America",
      countryOfOrigin: "United States, Canada",
      indigenousTribesOrGroup: "Numerous Tribes (Cherokee, Ojibwe, Cree)",
      traditionalUses: "Pain reliever, reducing fevers, treating headaches",
      popularProductForm: "Nutraceuticals, herbal extracts",
      timeframe: "Traditional knowledge passed down through generations",
      associatedCeremony: "Healing ceremonies, often associated with pain relief",
      veterinaryUse: "Yes - Pain relief in dogs and horses, anti-inflammatory",
      sustainabilityNotes: "Sustainably harvested bark without harming trees",
      researchStatus: "Source of salicin, precursor to aspirin - extensively researched"
    }
  ];

  try {
    console.log('Populating plants...');
    const plants = await storage.createGlobalIndigenousPlants(globalPlantsData);
    console.log('Successfully populated', plants.length, 'plants');
    return plants;
  } catch (error) {
    console.error('Error populating plants:', error);
    throw error;
  }
}

populatePlants().then(() => {
  console.log('Population complete');
  process.exit(0);
}).catch(err => {
  console.error('Population failed:', err);
  process.exit(1);
});