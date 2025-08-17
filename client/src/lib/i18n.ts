import { useState, useEffect } from 'react';

export type Language = 'en' | 'de' | 'fr' | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' }
];

// Translation keys and their values for each language
export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.plantExplorer': 'Plant Explorer',
    'nav.plantOrbit': 'Plant Orbit',
    'nav.aiRecommendations': 'AI Recommendations',
    'nav.learningHub': 'Learning Hub',
    'nav.askHealer': 'Ask Healer',
    'nav.impactRewards': 'Impact Rewards',
    'nav.science': 'Science',
    'nav.about': 'About',
    'nav.healthConcerns': 'Health Concerns',
    
    // Hero Section
    'hero.title': 'RÜTZ',
    'hero.tagline': 'ROOTED IN WISDOM. PERFECTED BY SCIENCE.',
    'hero.description': 'We unite Indigenous Canadian plant wisdom and German scientific precision to create the world\'s most trusted botanical extracts—while giving back to the First Nations communities and boreal ecosystems that inspire them.',
    'hero.quote': '"From the pristine Canadian wilderness where Indigenous Nations have gathered medicinal plants for millennia, to the advanced research labs of Fraunhofer." - Every extract is ethically sourced through respectful partnerships with Indigenous Canadian communities.',
    'hero.cta': 'Explore Products',
    'hero.learnMore': 'Learn More',
    
    // Product Categories
    'products.title': 'Premium Botanical Portfolio',
    'products.subtitle': 'Ethically Sourced • Scientifically Validated',
    'products.description': 'Discover our complete collection of ethically sourced botanical extracts, each with its own story of indigenous wisdom and scientific validation.',
    'products.allProducts': 'All Products',
    'products.extractPowders': 'Extract Powders',
    'products.capsules': 'Capsules',
    'products.herbalTeas': 'Herbal Teas',
    'products.latteMixes': 'Latte Mixes',
    'products.skincare': 'Skincare',
    'products.extracts': 'Extracts',
    'products.supplements': 'Supplements',
    'products.rawMaterials': 'Raw Materials',
    'products.wildHarvested': 'Wild Harvested',
    'products.applications': 'Applications',
    'products.sectors': 'Sectors',
    'products.gridView': 'Grid View',
    'products.detailedView': 'Detailed View',
    'products.loading': 'Loading products...',
    'products.inStock': 'In Stock',
    'products.outOfStock': 'Out of Stock',
    'products.reviews': 'reviews',
    'products.certifications': 'Certifications',
    'products.bioactive': 'Bioactive Compounds',
    'products.sustainability': 'Sustainability Story',
    'products.communityImpact': 'Community Impact',
    'products.researchPapers': 'Research Papers',
    'products.extractionMethod': 'Extraction Method',
    'products.scientificName': 'Scientific Name',
    
    // Healer Categories
    'healer.title': 'Ask a Healer',
    'healer.subtitle': 'Connect with Indigenous healers, shamans, and wisdom keepers who carry generations of plant medicine knowledge and spiritual guidance',
    'healer.types': 'Healer Types',
    'healer.practitioners': 'Practitioners',
    'healer.support': 'Support',
    'healer.traditions': 'Indigenous Healing Traditions',
    'healer.traditionsDesc': 'Each healer brings unique wisdom from their ancestral traditions, offering personalized guidance for your healing journey',
    'healer.readyTitle': 'Ready to Begin Your Healing Journey?',
    'healer.readyDesc': 'Our healers are here to guide you with wisdom passed down through generations. Choose the type of healing that resonates with your spirit.',
    'healer.startJourney': 'Start Your Healing Journey',
    'healer.connectWith': 'Connect with',
    'healer.availablePractitioners': 'Available Practitioners',
    'healer.status': 'Status',
    'healer.specialties': 'Healing Specialties',
    'healer.ceremonyVideo': 'Sacred Ceremony Experience',
    
    // Healer Types
    'healer.indigenousHealer': 'Indigenous Healer',
    'healer.indigenousHealerDesc': 'Traditional healers preserving ancestral plant medicine knowledge',
    'healer.shaman': 'Shaman',
    'healer.shamanDesc': 'Spiritual guides bridging physical and spiritual realms',
    'healer.ceremonyLeader': 'Ceremony Leader',
    'healer.ceremonyLeaderDesc': 'Facilitators of sacred healing ceremonies and rituals',
    'healer.ritualSpecialist': 'Ritual Specialist',
    'healer.ritualSpecialistDesc': 'Experts in traditional healing rituals and practices',
    'healer.meditationGuide': 'Meditation Guide',
    'healer.meditationGuideDesc': 'Teachers of indigenous meditation and mindfulness practices',
    'healer.medicinePerson': 'Medicine Person',
    'healer.medicinePersonDesc': 'Keepers of traditional herbal medicine and healing knowledge',
    'healer.listener': 'Listener',
    'healer.listenerDesc': 'Compassionate healers who provide deep listening and counsel',
    'healer.elderWisdom': 'Elder Wisdom',
    'healer.elderWisdomDesc': 'Respected elders sharing lifetime knowledge and guidance',
    
    // Common Terms
    'common.available': 'Available',
    'common.limited': 'Limited',
    'common.loading': 'Loading...',
    'common.price': 'Price',
    'common.addToCart': 'Add to Cart',
    'common.learnMore': 'Learn More',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    
    // About Page
    'about.title': 'About RÜTZ',
    'about.mission': 'Our Mission',
    'about.vision': 'Our Vision',
    'about.values': 'Our Values',
    
    // Footer
    'footer.tagline': 'Rooted in Wisdom. Perfected by Science. Every extract gives back to the communities and ecosystems that inspire them.',
    'footer.copyright': '© 2025 RÜTZ. All rights reserved.',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.products': 'Products',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.connect': 'Connect'
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.plantExplorer': 'Pflanzen-Explorer',
    'nav.plantOrbit': 'Pflanzen-Orbit',
    'nav.aiRecommendations': 'KI-Empfehlungen',
    'nav.learningHub': 'Lern-Hub',
    'nav.askHealer': 'Heiler fragen',
    'nav.impactRewards': 'Impact-Belohnungen',
    'nav.science': 'Wissenschaft',
    'nav.about': 'Über uns',
    'nav.healthConcerns': 'Gesundheitsprobleme',
    
    // Hero Section
    'hero.title': 'RÜTZ',
    'hero.tagline': 'VERWURZELT IN WEISHEIT. PERFEKTIONIERT DURCH WISSENSCHAFT.',
    'hero.description': 'Wir vereinen indigene kanadische Pflanzenwweisheit und deutsche wissenschaftliche Präzision, um die vertrauenswürdigsten botanischen Extrakte der Welt zu schaffen—während wir den First Nations-Gemeinschaften und borealen Ökosystemen etwas zurückgeben, die uns inspirieren.',
    'hero.quote': '"Von der unberührten kanadischen Wildnis, wo indigene Nationen seit Jahrtausenden Heilpflanzen sammeln, bis zu den fortschrittlichen Forschungslabors von Fraunhofer." - Jeder Extrakt wird ethisch durch respektvolle Partnerschaften mit indigenen kanadischen Gemeinschaften bezogen.',
    'hero.cta': 'Produkte erkunden',
    'hero.learnMore': 'Mehr erfahren',
    
    // Product Categories
    'products.title': 'Premium Botanisches Portfolio',
    'products.subtitle': 'Ethisch beschafft • Wissenschaftlich validiert',
    'products.description': 'Entdecken Sie unsere vollständige Sammlung ethisch beschaffter botanischer Extrakte, jeder mit seiner eigenen Geschichte indigener Weisheit und wissenschaftlicher Validierung.',
    'products.allProducts': 'Alle Produkte',
    'products.extractPowders': 'Extraktpulver',
    'products.capsules': 'Kapseln',
    'products.herbalTeas': 'Kräutertees',
    'products.latteMixes': 'Latte-Mischungen',
    'products.skincare': 'Hautpflege',
    'products.extracts': 'Extrakte',
    'products.supplements': 'Nahrungsergänzungsmittel',
    'products.rawMaterials': 'Rohstoffe',
    'products.wildHarvested': 'Wild geerntet',
    'products.applications': 'Anwendungen',
    'products.sectors': 'Sektoren',
    'products.gridView': 'Rasteransicht',
    'products.detailedView': 'Detailansicht',
    'products.loading': 'Produkte werden geladen...',
    'products.inStock': 'Auf Lager',
    'products.outOfStock': 'Nicht vorrätig',
    'products.reviews': 'Bewertungen',
    'products.certifications': 'Zertifizierungen',
    'products.bioactive': 'Bioaktive Verbindungen',
    'products.sustainability': 'Nachhaltigkeitsgeschichte',
    'products.communityImpact': 'Gemeinschaftsimpact',
    'products.researchPapers': 'Forschungsarbeiten',
    'products.extractionMethod': 'Extraktionsmethode',
    'products.scientificName': 'Wissenschaftlicher Name',
    
    // Healer Categories
    'healer.title': 'Einen Heiler fragen',
    'healer.subtitle': 'Verbinden Sie sich mit indigenen Heilern, Schamanen und Weisheitshütern, die Generationen von Pflanzenmedizin-Wissen und spiritueller Führung in sich tragen',
    'healer.types': 'Heiler-Typen',
    'healer.practitioners': 'Praktizierende',
    'healer.support': 'Unterstützung',
    'healer.traditions': 'Indigene Heiltraditionen',
    'healer.traditionsDesc': 'Jeder Heiler bringt einzigartige Weisheit aus seinen angestammten Traditionen mit und bietet personalisierte Führung für Ihre Heilungsreise',
    'healer.readyTitle': 'Bereit, Ihre Heilungsreise zu beginnen?',
    'healer.readyDesc': 'Unsere Heiler sind hier, um Sie mit Weisheit zu führen, die über Generationen weitergegeben wurde. Wählen Sie die Art der Heilung, die mit Ihrem Geist in Resonanz steht.',
    'healer.startJourney': 'Heilungsreise beginnen',
    'healer.connectWith': 'Verbinden mit',
    'healer.availablePractitioners': 'Verfügbare Praktizierende',
    'healer.status': 'Status',
    'healer.specialties': 'Heilspezialitäten',
    'healer.ceremonyVideo': 'Heilige Zeremonie-Erfahrung',
    
    // Healer Types
    'healer.indigenousHealer': 'Indigener Heiler',
    'healer.indigenousHealerDesc': 'Traditionelle Heiler, die angestammtes Pflanzenmedizin-Wissen bewahren',
    'healer.shaman': 'Schamane',
    'healer.shamanDesc': 'Spirituelle Führer, die physische und spirituelle Welten verbinden',
    'healer.ceremonyLeader': 'Zeremonienleiter',
    'healer.ceremonyLeaderDesc': 'Facilitatoren heiliger Heilzeremonien und Rituale',
    'healer.ritualSpecialist': 'Ritual-Spezialist',
    'healer.ritualSpecialistDesc': 'Experten für traditionelle Heilrituale und -praktiken',
    'healer.meditationGuide': 'Meditations-Guide',
    'healer.meditationGuideDesc': 'Lehrer indigener Meditations- und Achtsamkeitspraktiken',
    'healer.medicinePerson': 'Medizinperson',
    'healer.medicinePersonDesc': 'Hüter traditioneller Kräutermedizin und Heilungswissen',
    'healer.listener': 'Zuhörer',
    'healer.listenerDesc': 'Mitfühlende Heiler, die tiefes Zuhören und Beratung bieten',
    'healer.elderWisdom': 'Ältesten-Weisheit',
    'healer.elderWisdomDesc': 'Respektierte Älteste, die lebenslange Kenntnisse und Führung teilen',
    
    // Common Terms
    'common.available': 'Verfügbar',
    'common.limited': 'Begrenzt',
    'common.loading': 'Lädt...',
    'common.price': 'Preis',
    'common.addToCart': 'In den Warenkorb',
    'common.learnMore': 'Mehr erfahren',
    'common.readMore': 'Weiterlesen',
    'common.viewAll': 'Alle anzeigen',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    
    // About Page
    'about.title': 'Über RÜTZ',
    'about.mission': 'Unsere Mission',
    'about.vision': 'Unsere Vision',
    'about.values': 'Unsere Werte',
    
    // Footer
    'footer.tagline': 'Verwurzelt in Weisheit. Perfektioniert durch Wissenschaft. Jeder Extrakt gibt den Gemeinschaften und Ökosystemen etwas zurück, die uns inspirieren.',
    'footer.copyright': '© 2025 RÜTZ. Alle Rechte vorbehalten.',
    'footer.contact': 'Kontakt',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.products': 'Produkte',
    'footer.company': 'Unternehmen',
    'footer.support': 'Support',
    'footer.connect': 'Verbinden'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.plantExplorer': 'Explorateur de Plantes',
    'nav.plantOrbit': 'Orbite des Plantes',
    'nav.aiRecommendations': 'Recommandations IA',
    'nav.learningHub': 'Hub d\'Apprentissage',
    'nav.askHealer': 'Demander un Guérisseur',
    'nav.impactRewards': 'Récompenses d\'Impact',
    'nav.science': 'Science',
    'nav.about': 'À propos',
    'nav.healthConcerns': 'Préoccupations Santé',
    
    // Hero Section
    'hero.title': 'RÜTZ',
    'hero.tagline': 'ENRACINÉ DANS LA SAGESSE. PERFECTIONNÉ PAR LA SCIENCE.',
    'hero.description': 'Nous unissons la sagesse végétale indigène canadienne et la précision scientifique allemande pour créer les extraits botaniques les plus fiables au monde—tout en redonnant aux communautés des Premières Nations et aux écosystèmes boréaux qui nous inspirent.',
    'hero.quote': '"De la nature sauvage canadienne immaculée où les Nations indigènes récoltent des plantes médicinales depuis des millénaires, aux laboratoires de recherche avancés de Fraunhofer." - Chaque extrait est obtenu de manière éthique grâce à des partenariats respectueux avec les communautés indigènes canadiennes.',
    'hero.cta': 'Explorer les Produits',
    'hero.learnMore': 'En savoir plus',
    
    // Product Categories
    'products.title': 'Portfolio Botanique Premium',
    'products.subtitle': 'Source Éthique • Validé Scientifiquement',
    'products.description': 'Découvrez notre collection complète d\'extraits botaniques d\'origine éthique, chacun avec sa propre histoire de sagesse indigène et de validation scientifique.',
    'products.allProducts': 'Tous les Produits',
    'products.extractPowders': 'Poudres d\'Extrait',
    'products.capsules': 'Gélules',
    'products.herbalTeas': 'Tisanes',
    'products.latteMixes': 'Mélanges Latte',
    'products.skincare': 'Soins de la Peau',
    'products.extracts': 'Extraits',
    'products.supplements': 'Suppléments',
    'products.rawMaterials': 'Matières Premières',
    'products.wildHarvested': 'Récolté Sauvage',
    'products.applications': 'Applications',
    'products.sectors': 'Secteurs',
    'products.gridView': 'Vue Grille',
    'products.detailedView': 'Vue Détaillée',
    'products.loading': 'Chargement des produits...',
    'products.inStock': 'En Stock',
    'products.outOfStock': 'Rupture de Stock',
    'products.reviews': 'avis',
    'products.certifications': 'Certifications',
    'products.bioactive': 'Composés Bioactifs',
    'products.sustainability': 'Histoire de Durabilité',
    'products.communityImpact': 'Impact Communautaire',
    'products.researchPapers': 'Articles de Recherche',
    'products.extractionMethod': 'Méthode d\'Extraction',
    'products.scientificName': 'Nom Scientifique',
    
    // Healer Categories
    'healer.title': 'Demander un Guérisseur',
    'healer.subtitle': 'Connectez-vous avec des guérisseurs indigènes, des chamans et des gardiens de sagesse qui portent des générations de connaissances en médecine végétale et guidance spirituelle',
    'healer.types': 'Types de Guérisseurs',
    'healer.practitioners': 'Praticiens',
    'healer.support': 'Support',
    'healer.traditions': 'Traditions de Guérison Indigènes',
    'healer.traditionsDesc': 'Chaque guérisseur apporte une sagesse unique de ses traditions ancestrales, offrant des conseils personnalisés pour votre voyage de guérison',
    'healer.readyTitle': 'Prêt à Commencer Votre Voyage de Guérison?',
    'healer.readyDesc': 'Nos guérisseurs sont là pour vous guider avec la sagesse transmise à travers les générations. Choisissez le type de guérison qui résonne avec votre esprit.',
    'healer.startJourney': 'Commencer Votre Voyage de Guérison',
    'healer.connectWith': 'Se connecter avec',
    'healer.availablePractitioners': 'Praticiens Disponibles',
    'healer.status': 'Statut',
    'healer.specialties': 'Spécialités de Guérison',
    'healer.ceremonyVideo': 'Expérience de Cérémonie Sacrée',
    
    // Healer Types
    'healer.indigenousHealer': 'Guérisseur Indigène',
    'healer.indigenousHealerDesc': 'Guérisseurs traditionnels préservant les connaissances ancestrales en médecine végétale',
    'healer.shaman': 'Chaman',
    'healer.shamanDesc': 'Guides spirituels reliant les mondes physique et spirituel',
    'healer.ceremonyLeader': 'Chef de Cérémonie',
    'healer.ceremonyLeaderDesc': 'Facilitateurs de cérémonies de guérison sacrées et de rituels',
    'healer.ritualSpecialist': 'Spécialiste des Rituels',
    'healer.ritualSpecialistDesc': 'Experts en rituels et pratiques de guérison traditionnels',
    'healer.meditationGuide': 'Guide de Méditation',
    'healer.meditationGuideDesc': 'Enseignants de méditation indigène et pratiques de pleine conscience',
    'healer.medicinePerson': 'Personne Médecine',
    'healer.medicinePersonDesc': 'Gardiens de la médecine traditionnelle à base de plantes et des connaissances de guérison',
    'healer.listener': 'Écouteur',
    'healer.listenerDesc': 'Guérisseurs compatissants qui offrent une écoute profonde et des conseils',
    'healer.elderWisdom': 'Sagesse des Anciens',
    'healer.elderWisdomDesc': 'Anciens respectés partageant les connaissances et la guidance d\'une vie',
    
    // Common Terms
    'common.available': 'Disponible',
    'common.limited': 'Limité',
    'common.loading': 'Chargement...',
    'common.price': 'Prix',
    'common.addToCart': 'Ajouter au Panier',
    'common.learnMore': 'En savoir plus',
    'common.readMore': 'Lire la suite',
    'common.viewAll': 'Voir tout',
    'common.close': 'Fermer',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    
    // About Page
    'about.title': 'À propos de RÜTZ',
    'about.mission': 'Notre Mission',
    'about.vision': 'Notre Vision',
    'about.values': 'Nos Valeurs',
    
    // Footer
    'footer.tagline': 'Enraciné dans la Sagesse. Perfectionné par la Science. Chaque extrait redonne aux communautés et écosystèmes qui nous inspirent.',
    'footer.copyright': '© 2025 RÜTZ. Tous droits réservés.',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.products': 'Produits',
    'footer.company': 'Entreprise',
    'footer.support': 'Support',
    'footer.connect': 'Se Connecter'
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.plantExplorer': 'Explorador de Plantas',
    'nav.plantOrbit': 'Órbita de Plantas',
    'nav.aiRecommendations': 'Recomendaciones IA',
    'nav.learningHub': 'Centro de Aprendizaje',
    'nav.askHealer': 'Consultar Sanador',
    'nav.impactRewards': 'Recompensas de Impacto',
    'nav.science': 'Ciencia',
    'nav.about': 'Acerca de',
    'nav.healthConcerns': 'Preocupaciones de Salud',
    
    // Hero Section
    'hero.title': 'RÜTZ',
    'hero.tagline': 'ARRAIGADO EN SABIDURÍA. PERFECCIONADO POR LA CIENCIA.',
    'hero.description': 'Unimos la sabiduría vegetal indígena canadiense y la precisión científica alemana para crear los extractos botánicos más confiables del mundo—mientras devolvemos a las comunidades de las Primeras Naciones y ecosistemas boreales que nos inspiran.',
    'hero.quote': '"Desde la naturaleza salvaje canadiense prístina donde las Naciones indígenas han recolectado plantas medicinales durante milenios, hasta los laboratorios de investigación avanzados de Fraunhofer." - Cada extracto se obtiene éticamente a través de asociaciones respetuosas con las comunidades indígenas canadienses.',
    'hero.cta': 'Explorar Productos',
    'hero.learnMore': 'Saber más',
    
    // Product Categories
    'products.title': 'Portafolio Botánico Premium',
    'products.subtitle': 'Éticamente Obtenido • Científicamente Validado',
    'products.description': 'Descubra nuestra colección completa de extractos botánicos de origen ético, cada uno con su propia historia de sabiduría indígena y validación científica.',
    'products.allProducts': 'Todos los Productos',
    'products.extractPowders': 'Polvos de Extracto',
    'products.capsules': 'Cápsulas',
    'products.herbalTeas': 'Tés Herbales',
    'products.latteMixes': 'Mezclas Latte',
    'products.skincare': 'Cuidado de la Piel',
    'products.extracts': 'Extractos',
    'products.supplements': 'Suplementos',
    'products.rawMaterials': 'Materias Primas',
    'products.wildHarvested': 'Cosechado Silvestre',
    'products.applications': 'Aplicaciones',
    'products.sectors': 'Sectores',
    'products.gridView': 'Vista de Cuadrícula',
    'products.detailedView': 'Vista Detallada',
    'products.loading': 'Cargando productos...',
    'products.inStock': 'En Stock',
    'products.outOfStock': 'Agotado',
    'products.reviews': 'reseñas',
    'products.certifications': 'Certificaciones',
    'products.bioactive': 'Compuestos Bioactivos',
    'products.sustainability': 'Historia de Sostenibilidad',
    'products.communityImpact': 'Impacto Comunitario',
    'products.researchPapers': 'Artículos de Investigación',
    'products.extractionMethod': 'Método de Extracción',
    'products.scientificName': 'Nombre Científico',
    
    // Healer Categories
    'healer.title': 'Consultar un Sanador',
    'healer.subtitle': 'Conéctese con sanadores indígenas, chamanes y guardianes de sabiduría que llevan generaciones de conocimiento en medicina vegetal y guía espiritual',
    'healer.types': 'Tipos de Sanadores',
    'healer.practitioners': 'Practicantes',
    'healer.support': 'Soporte',
    'healer.traditions': 'Tradiciones de Sanación Indígenas',
    'healer.traditionsDesc': 'Cada sanador aporta sabiduría única de sus tradiciones ancestrales, ofreciendo guía personalizada para su viaje de sanación',
    'healer.readyTitle': '¿Listo para Comenzar su Viaje de Sanación?',
    'healer.readyDesc': 'Nuestros sanadores están aquí para guiarlo con sabiduría transmitida a través de generaciones. Elija el tipo de sanación que resuene con su espíritu.',
    'healer.startJourney': 'Comenzar su Viaje de Sanación',
    'healer.connectWith': 'Conectar con',
    'healer.availablePractitioners': 'Practicantes Disponibles',
    'healer.status': 'Estado',
    'healer.specialties': 'Especialidades de Sanación',
    'healer.ceremonyVideo': 'Experiencia de Ceremonia Sagrada',
    
    // Healer Types
    'healer.indigenousHealer': 'Sanador Indígena',
    'healer.indigenousHealerDesc': 'Sanadores tradicionales que preservan el conocimiento ancestral de medicina vegetal',
    'healer.shaman': 'Chamán',
    'healer.shamanDesc': 'Guías espirituales que conectan los mundos físico y espiritual',
    'healer.ceremonyLeader': 'Líder de Ceremonia',
    'healer.ceremonyLeaderDesc': 'Facilitadores de ceremonias de sanación sagradas y rituales',
    'healer.ritualSpecialist': 'Especialista en Rituales',
    'healer.ritualSpecialistDesc': 'Expertos en rituales y prácticas de sanación tradicionales',
    'healer.meditationGuide': 'Guía de Meditación',
    'healer.meditationGuideDesc': 'Maestros de meditación indígena y prácticas de atención plena',
    'healer.medicinePerson': 'Persona Medicina',
    'healer.medicinePersonDesc': 'Guardianes de la medicina herbal tradicional y conocimiento de sanación',
    'healer.listener': 'Escuchador',
    'healer.listenerDesc': 'Sanadores compasivos que brindan escucha profunda y consejería',
    'healer.elderWisdom': 'Sabiduría de Ancianos',
    'healer.elderWisdomDesc': 'Ancianos respetados que comparten conocimiento y guía de toda la vida',
    
    // Common Terms
    'common.available': 'Disponible',
    'common.limited': 'Limitado',
    'common.loading': 'Cargando...',
    'common.price': 'Precio',
    'common.addToCart': 'Agregar al Carrito',
    'common.learnMore': 'Saber más',
    'common.readMore': 'Leer más',
    'common.viewAll': 'Ver todo',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    
    // About Page
    'about.title': 'Acerca de RÜTZ',
    'about.mission': 'Nuestra Misión',
    'about.vision': 'Nuestra Visión',
    'about.values': 'Nuestros Valores',
    
    // Footer
    'footer.tagline': 'Arraigado en Sabiduría. Perfeccionado por la Ciencia. Cada extracto devuelve a las comunidades y ecosistemas que nos inspiran.',
    'footer.copyright': '© 2025 RÜTZ. Todos los derechos reservados.',
    'footer.contact': 'Contacto',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.products': 'Productos',
    'footer.company': 'Empresa',
    'footer.support': 'Soporte',
    'footer.connect': 'Conectar'
  }
};

// Hook for using translations
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
    }
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key as keyof typeof translations['en']] || key;
  };

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    languages
  };
}