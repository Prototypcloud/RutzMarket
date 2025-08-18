import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, Users, Award, Globe, MapPin, Calendar, ChevronDown, FileText, Target, Shield, Lightbulb, Building2, DollarSign, TrendingUp, Leaf, Microscope, Scale, Beaker, Book, CheckCircle } from "lucide-react";
import { useState } from "react";

const timeline = [
  {
    year: "2019",
    title: "Foundation",
    description: "RÜTZ founded with vision to bridge indigenous wisdom and modern science"
  },
  {
    year: "2020",
    title: "First Partnerships",
    description: "Established relationships with 3 indigenous communities in Northern Ontario"
  },
  {
    year: "2021",
    title: "Research Collaborations",
    description: "Partnerships with Fraunhofer Institute and University of Toronto"
  },
  {
    year: "2022",
    title: "Certification Success",
    description: "Achieved ISO certifications and Health Canada NPN approvals"
  },
  {
    year: "2023",
    title: "Expansion",
    description: "Extended partnerships to 12 communities across Canada"
  },
  {
    year: "2024",
    title: "Innovation",
    description: "Launched Plant Explorer and AI-powered recommendation system"
  }
];

const team = [
  {
    name: "Michaela",
    role: "Co Founder & CEO",
    background: "Art & Education & Business Development",
    focus: "Indigenous partnership development"
  },
  {
    name: "Dr. Klaus",
    role: "Chief Science Officer",
    background: "Former Fraunhofer researcher, 15+ years botanical extraction",
    focus: "Advanced extraction technologies"
  },
  {
    name: "Maria",
    role: "Head of Sustainability",
    background: "Environmental science, carbon management expertise",
    focus: "Environmental impact and sustainability"
  },
  {
    name: "Alex",
    role: "Head of Community Relations",
    background: "Seasoned project Management, community development specialist",
    focus: "Indigenous community partnerships"
  }
];

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Respect",
    description: "Honoring indigenous knowledge, traditions, and sovereignty in all our partnerships"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description: "Building meaningful relationships based on mutual benefit and shared values"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Excellence",
    description: "Maintaining the highest standards in science, quality, and ethical business practices"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Sustainability",
    description: "Protecting our planet for future generations through regenerative practices"
  }
];

const awards = [
  {
    year: "2025",
    award: "Indigenous Business Award",
    organization: "Canadian Council for Aboriginal Business"
  },
  {
    year: "2026 Pending",
    award: "Sustainability Excellence Award",
    organization: "Natural Health Products Association"
  },
  {
    year: "2025",
    award: "Innovation in Extraction Technology",
    organization: "International Botanical Congress"
  },
  {
    year: "2025",
    award: "Ethical Business Practices Award",
    organization: "B Corp Certification"
  }
];

const socialEnterpriseContent = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    icon: <FileText className="w-5 h-5" />,
    content: `Beyond Nature "Tribe" is a groundbreaking initiative developed by Beyond Change (EU) to establish a globally scalable, fully automated onboarding and governance platform for co-creating social enterprises in partnership with Indigenous tribes. Each venture ensures Indigenous sovereignty by securing a 51% ownership for the partnering tribe, enabling equitable, regenerative, and culturally grounded economic development.`
  },
  {
    id: "problem-statement", 
    title: "Problem Statement",
    icon: <Target className="w-5 h-5" />,
    content: `Indigenous communities face significant barriers to entering equitable business partnerships due to:

• Complex, slow, and costly incorporation processes
• Lack of access to transparent legal and governance frameworks  
• Risk of cultural exploitation and sovereignty erosion
• Traditional partnership models often fail to center Indigenous values, prioritize short-term profits, and lack long-term regenerative impact.`
  },
  {
    id: "vision-objectives",
    title: "Vision & Objectives", 
    icon: <Lightbulb className="w-5 h-5" />,
    content: `Vision: Empower Indigenous tribes worldwide to co-create regenerative social enterprises that honor their sovereignty, culture, and ecological stewardship.

Core Objectives:
• Enable 51% tribal ownership in every venture
• Automate incorporation and governance
• Reduce negotiation time and legal costs
• Provide transparent, tamper-proof records using blockchain
• Create DAO-ready governance structures`
  },
  {
    id: "partnership-model",
    title: "Partnership Model",
    icon: <Users className="w-5 h-5" />,
    content: `Each new entity, called Beyond Nature "Tribe", is co-founded by:

Tribe (51%) – holds controlling interest, cultural rights, and strategic influence
Beyond Change (49%) – provides capital, infrastructure, and global reach

The partnership prioritizes long-term regeneration over short-term profit, with community-defined KPIs.`
  },
  {
    id: "governance-framework",
    title: "Governance Framework",
    icon: <Shield className="w-5 h-5" />,
    content: `Dual Circle Governance Model:

Tribal Sovereign Council: Holds veto power on all cultural, land, and sovereignty matters
Operational Circle: Jointly managed board (Beyond Change + Tribe) handles daily operations

Smart Governance Layer:
• Smart contracts automate equity splits, voting, and revenue sharing
• Blockchain ledger ensures transparency in operations and finances`
  },
  {
    id: "technology-platform",
    title: "TribeForge Technology Platform",
    icon: <Building2 className="w-5 h-5" />,
    content: `TribeForge is the automated onboarding platform with:

• KYC for tribal representatives
• Auto-generation of legal agreements
• eSignature and blockchain registration
• Customizable governance templates
• Embedded education on rights and responsibilities

User Flow:
1. Tribe inputs basic information
2. Platform verifies sovereign status via Indigenous Network
3. Legal docs are generated and signed
4. Blockchain records the incorporation
5. Operational dashboard is activated`
  },
  {
    id: "economic-model",
    title: "Economic Model",
    icon: <DollarSign className="w-5 h-5" />,
    content: `Revenue Distribution:
• 51% Net Profit: Directly to the tribe
• 49% Net Profit: Beyond Change

Reinvestment Model:
• Minimum 10% reinvested in local ecology/culture projects
• Carbon/nature credits tokenized, 51% returned to the community`
  },
  {
    id: "long-term-strategy",
    title: "Long-Term Strategy",
    icon: <TrendingUp className="w-5 h-5" />,
    content: `Strategic Goals:
• Onboard 100+ tribes by 2030
• Launch a global TribeDAO for inter-tribal governance
• Create a registry of Indigenous-led regenerative ventures
• Form partnerships with global institutions for climate and cultural resilience

Conclusion: Beyond Nature "Tribe" offers a bold, systemic redesign of how Indigenous communities can lead regenerative enterprises on their terms. With sovereignty, automation, and equity at its core, the initiative aims to become a blueprint for ethical, scalable, and decentralized economic transformation.`
  }
];

const franchiseModelContent = [
  {
    id: "legal-foundation",
    title: "Legal Foundation",
    icon: <Scale className="w-5 h-5" />,
    content: `Under Canadian law, RÜTZ's franchise model is governed by provincial franchise legislation. Our comprehensive legal framework includes:

• Franchise Agreement: Sets out rights, obligations, and brand standards
• Disclosure Document: Required in regulated provinces; provided 14 days before signing
• Trademark Licensing: Secure IP rights (logos, processes, trade dress)
• Operations Manual: Detailed procedures for harvesting, production, sales, and community engagement`
  },
  {
    id: "franchise-structure",
    title: "Franchise Structure Options",
    icon: <Building2 className="w-5 h-5" />,
    content: `We offer three distinct franchise models to accommodate different partnership goals:

• Master Franchise Model: For Indigenous-led or regional operators managing sub-franchisees in a territory
• Single Unit Franchise: Local operator runs one harvesting and processing location
• Area Development Agreement: Grants rights to open multiple units in a specific region`
  },
  {
    id: "fee-structure",
    title: "Investment & Fee Structure",
    icon: <DollarSign className="w-5 h-5" />,
    content: `Initial Franchise Fee: CAD $25,000 – $50,000 (depending on territory size and exclusivity)

Ongoing Fees:
• Royalties: 5–8% of gross revenue (reduced rates for Indigenous-owned franchisees)
• Marketing Fund: 1–3% of gross sales for national/international marketing
• Social Impact Contribution: 1–2% earmarked for Indigenous community benefit projects
• Management Fee: 8–12% if RÜTZ manages operations directly (turnkey model)`
  },
  {
    id: "social-impact",
    title: "Social Impact Commitment",
    icon: <Heart className="w-5 h-5" />,
    content: `Our franchise model prioritizes social responsibility and Indigenous partnership:

• Reduced royalty rates for Indigenous-owned franchisees
• Mandatory community benefit contributions
• Cultural IP protection in all agreements
• Training includes traditional knowledge respect and community engagement
• Clear dispute resolution through mediation and arbitration`
  },
  {
    id: "compliance-support",
    title: "Compliance & Support",
    icon: <Shield className="w-5 h-5" />,
    content: `Comprehensive support system for all franchisees:

• Full compliance with provincial franchise acts
• Ongoing training and certification programs
• Quality control audits and standards maintenance
• Supply chain management and bulk purchasing benefits
• Access to specialized equipment and inputs at preferred rates`
  }
];

const indigenousWildHarvestContent = [
  {
    id: "definition",
    title: "What is Indigenous Wild Harvest?",
    icon: <Leaf className="w-5 h-5" />,
    content: `Indigenous wild harvest is the community-led, place-based collection of non-cultivated species (plants/fungi) from their natural habitats, conducted under Free, Prior and Informed Consent (FPIC) and Access-and-Benefit-Sharing (ABS) with Indigenous rights-holders.

It follows Good Agricultural and Collection Practices (GACP) and sustainable-use standards to protect species, habitats, and culture, and embeds shared governance of knowledge, materials, data, and benefits across the value chain.

Why it matters: Indigenous food systems steward biodiversity and nutrient-dense "wild foods," linking diet, social systems, and ecosystem health; these systems are proven reservoirs of safe foods and pharmacologically rich botanicals.`
  },
  {
    id: "principles",
    title: "Fundamental Principles for R&D and Commercialization",
    icon: <Scale className="w-5 h-5" />,
    content: `Rights & relationships first: Respect UNDRIP (FPIC, self-determination) and the Nagoya Protocol (fair, equitable benefit-sharing) from scoping to post-market. Benefits should combine revenue-sharing, decision seats, and capacity-building.

Two-Eyed Seeing: Integrate Indigenous knowledge and Western science—co-define indications, culturally appropriate uses, and outcomes alongside lab analytics and clinical methods.

Sustainable, traceable collection: Apply WHO GACP and FairWild: resource assessments, no-take zones/rotations, collector safety, habitat protection, and full lot traceability.

Quality & safety by design: Build pharmaco-/nutri-vigilance and EFSA-style botanical risk assessment into development: correct ID (incl. DNA barcoding when needed), validated marker assays (HPLC/LC-MS), contaminant limits, stability, and label accuracy.

Evidence for claims: Follow the WHO TCIM strategy and regional rules: use literature/traditional-use evidence where acceptable; generate new clinical or nutritional data for higher-level claims.`
  },
  {
    id: "characteristics",
    title: "Characteristics of This Emerging Source of Well-Being",
    icon: <Microscope className="w-5 h-5" />,
    content: `Biocultural grounding: Diet-health practices are embedded in land, ceremony, and seasonal cycles—conferring adherence and meaning beyond ingredients alone.

Phytochemical richness with variability: Wild environments can enhance or shift bioactive profiles; rigorous specifications and batch-to-batch controls are essential.

High trust—if transparent: ABS documentation, Indigenous co-branding, third-party wild-collection standards, and open quality data earn patient/consumer trust.

Regulatory pluralism: The same material may be a food supplement in one market, a listed medicine in another, or a traditional herbal medicinal product in the EU—choose the pathway that fits evidence, claims, and intended use.`
  },
  {
    id: "product-categories",
    title: "From Forest to Finished Goods: Eligible Product Categories",
    icon: <Beaker className="w-5 h-5" />,
    content: `A. Dietary / Food Supplements (core nutraceuticals):
Standardized extract capsules/tablets/softgels; powders/drink mixes; gummies/chews; tinctures (hydroethanolic/glycerites); standardized single-herb or polyherbal blends reflecting traditional formulations.

B. Functional foods & beverages:
RTD shots (adaptogenic/nootropic/digestive), bars/granolas/fortified snacks, culturally justified ferments, microencapsulated actives for bakery/dairy/alt-protein.

C. Medical foods / Foods for Special Medical Purposes (FSMP):
For clinician-supervised dietary management of patients with needs unmet by normal diets; must meet EU definitions and be used under medical supervision.

D. Cosmeceuticals / Nutricosmetics:
"Beauty-from-within" supplements (skin/hair/collagen support) and topical adjuncts where traditional external use exists.

E. Traditional Herbal Medicinal Products / Listed Medicines:
EU THMPD simplified registration for long-standing traditional use; Australia TGA "Listed medicines"; Canada NHPs under Natural Health Products Regulations.`
  },
  {
    id: "safety-net",
    title: "Safety Net Across All Categories",
    icon: <Shield className="w-5 h-5" />,
    content: `Embed post-market safety monitoring (herbal/nutri-vigilance), adverse-event reporting, and periodic label/spec reviews; WHO provides templates to integrate herbal products into national pharmacovigilance systems.

Bottom line: Indigenous wild-harvested plants are a bioculturally rooted, phytochemically rich, and regulation-ready source of well-being—when and only when programs are co-designed with Indigenous partners (FPIC/ABS), harvested sustainably (GACP/FairWild), and developed with two-eyed evidence standards from identity to clinical use.`
  }
];

export default function About() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
      {/* RÜTZ Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Logo size="lg" />
      </div>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest to-sage text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About RÜTZ
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Bridging ancient wisdom and modern science to create exceptional botanical extracts
            </p>
            <Badge className="bg-cream text-forest px-6 py-2 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              Founded in Canada • Serving the World
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-forest mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                To unite indigenous plant wisdom with German scientific precision, creating the world's 
                most trusted botanical extracts while supporting indigenous communities and protecting 
                Canada's pristine wilderness.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that traditional knowledge, refined through thousands of years of careful 
                observation, combined with modern analytical science, creates products of unmatched 
                quality and efficacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-forest mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                A world where traditional plant knowledge is preserved, respected, and accessible 
                to all, while indigenous communities thrive as leaders in sustainable resource 
                management.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By 2030, we envision RÜTZ as the global standard for ethical botanical sourcing, 
                with a regenerative business model that gives back more than it takes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Enterprise Model */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Social Enterprise Model
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond Nature "Tribe" - Automated Indigenous Partnership Platform for Regenerative Social Enterprises
            </p>
            <Badge className="bg-forest text-white mt-4 px-4 py-2 text-sm">
              Version 1.0 | August 2025
            </Badge>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {socialEnterpriseContent.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Collapsible
                    open={openSections.has(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="w-full" data-testid={`button-toggle-${section.id}`}>
                      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <div className="text-forest">
                                {section.icon}
                              </div>
                              <CardTitle className="text-left text-lg text-forest">
                                {section.title}
                              </CardTitle>
                            </div>
                            <ChevronDown 
                              className={`w-5 h-5 text-forest transition-transform duration-200 ${
                                openSections.has(section.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <Card className="mt-2 border-l-4 border-l-forest">
                        <CardContent className="pt-6">
                          <div className="prose prose-forest max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Franchise Model */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Building2 className="w-12 h-12 text-forest mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Franchise Model
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expand with RÜTZ through our comprehensive franchise partnership program
            </p>
          </motion.div>

          <div className="grid gap-6">
            {franchiseModelContent.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Collapsible
                  open={openSections.has(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="w-full" data-testid={`button-toggle-${section.id}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-forest/10 rounded-lg">
                              {section.icon}
                            </div>
                            <CardTitle className="text-left text-forest">
                              {section.title}
                            </CardTitle>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-forest transition-transform duration-200 ${
                              openSections.has(section.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Card className="mt-2">
                      <CardContent className="pt-6">
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {section.content}
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Indigenous Wild Harvest */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-high-contrast text-heading mb-4">
              Indigenous Wild Harvest
            </h2>
            <p className="text-lg text-medium-contrast max-w-3xl mx-auto text-readable">
              Understanding the principles, proof, and product pathways of Indigenous wild-harvested plants for health
            </p>
            <Badge className="bg-earth-green text-white mt-4 px-4 py-2 text-sm">
              Principles, Proof & Product Pathways
            </Badge>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {indigenousWildHarvestContent.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Collapsible
                    open={openSections.has(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="w-full" data-testid={`button-toggle-${section.id}`}>
                      <Card className="card-enhanced hover:shadow-md transition-shadow duration-200 cursor-pointer">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <div className="text-earth-green">
                                {section.icon}
                              </div>
                              <CardTitle className="text-left text-lg text-high-contrast text-heading">
                                {section.title}
                              </CardTitle>
                            </div>
                            <ChevronDown 
                              className={`w-5 h-5 text-earth-green transition-transform duration-200 ${
                                openSections.has(section.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <Card className="mt-2 border-l-4 border-l-earth-green card-enhanced">
                        <CardContent className="pt-6">
                          <div className="prose prose-earth-green max-w-none">
                            <div className="text-medium-contrast text-readable leading-relaxed whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-forest">
                        {value.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-forest">
                          {value.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to industry leadership
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-forest text-white">{event.year}</Badge>
                        <CardTitle className="text-forest">{event.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diverse expertise united by shared values
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-forest">{member.name}</CardTitle>
                    <CardDescription className="text-lg">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-forest">Background: </span>
                        <span className="text-gray-700">{member.background}</span>
                      </div>
                      <div>
                        <span className="font-medium text-forest">Focus: </span>
                        <span className="text-gray-700">{member.focus}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Awards & Recognition
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry recognition for our commitment to excellence and ethics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={`${award.year}-${award.award}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Award className="w-8 h-8 text-forest" />
                      <div>
                        <CardTitle className="text-forest">{award.award}</CardTitle>
                        <CardDescription>{award.organization} • {award.year}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-cream mb-8 leading-relaxed">
              Experience the power of traditional wisdom enhanced by modern science. 
              Every purchase supports our mission to preserve indigenous knowledge and protect our planet.
            </p>
            <p className="text-lg text-cream/80">
              Together, we're not just creating products – we're creating a more sustainable, 
              respectful, and connected world.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}