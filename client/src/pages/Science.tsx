import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, FlaskConical, BookOpen, Award, Atom, Dna } from "lucide-react";

const researchPartners = [
  {
    name: "Fraunhofer Institute",
    location: "Germany",
    focus: "Advanced Extraction Technologies",
    collaboration: "Supercritical CO2 extraction optimization"
  },
  {
    name: "University of Toronto",
    location: "Canada",
    focus: "Phytochemical Analysis",
    collaboration: "Bioactive compound identification"
  },
  {
    name: "McGill University",
    location: "Montreal, QC",
    focus: "Traditional Medicine Research",
    collaboration: "Indigenous knowledge documentation"
  },
  {
    name: "TU Dresden",
    location: "Germany",
    focus: "Process Engineering",
    collaboration: "Sustainable extraction methods"
  }
];

const researchAreas = [
  {
    icon: <Microscope className="w-8 h-8" />,
    title: "Phytochemical Analysis",
    description: "Advanced analytical methods to identify and quantify bioactive compounds",
    techniques: ["HPLC-MS/MS", "NMR Spectroscopy", "GC-MS Analysis", "LC-QTOF"]
  },
  {
    icon: <FlaskConical className="w-8 h-8" />,
    title: "Extraction Optimization",
    description: "Cutting-edge extraction technologies to maximize potency and purity",
    techniques: ["Supercritical CO2", "Ultrasonic Extraction", "Microwave-Assisted", "Pressurized Liquids"]
  },
  {
    icon: <Dna className="w-8 h-8" />,
    title: "Bioactivity Testing",
    description: "Comprehensive testing of biological activities and therapeutic potential",
    techniques: ["Antioxidant Assays", "Anti-inflammatory", "Antimicrobial", "Cytotoxicity Studies"]
  },
  {
    icon: <Atom className="w-8 h-8" />,
    title: "Quality Assurance",
    description: "Rigorous testing protocols ensuring consistency and safety",
    techniques: ["Heavy Metals", "Pesticide Residues", "Microbial Testing", "Stability Studies"]
  }
];

const publications = [
  {
    title: "Chaga (Inonotus obliquus) Polysaccharides: Enhanced Extraction and Immunomodulatory Properties",
    journal: "Journal of Natural Products",
    year: "2024",
    authors: "Schmidt, K., Chen, L., Blackstone, M."
  },
  {
    title: "Traditional Indigenous Plant Knowledge: Modern Analytical Validation",
    journal: "Ethnopharmacology Today",
    year: "2024",
    authors: "Running Bear, J., Wilson, A., Martinez, R."
  },
  {
    title: "Sustainable Botanical Extraction: Supercritical CO2 Optimization",
    journal: "Green Chemistry Letters",
    year: "2023",
    authors: "Weber, H., Thompson, S., Lee, M."
  }
];

const certifications = [
  {
    name: "ISO 9001:2015",
    description: "Quality Management Systems"
  },
  {
    name: "ISO 14001:2015",
    description: "Environmental Management"
  },
  {
    name: "HACCP Certified",
    description: "Food Safety Management"
  },
  {
    name: "Health Canada NPN",
    description: "Natural Product Number"
  },
  {
    name: "GMP Certified",
    description: "Good Manufacturing Practices"
  }
];

export default function Science() {
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
              Scientific Excellence
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Where traditional wisdom meets cutting-edge analytical science
            </p>
            <Badge className="bg-cream text-forest px-6 py-2 text-lg">
              <Microscope className="w-5 h-5 mr-2" />
              German Engineering + Canadian Innovation
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
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
              Research & Development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced analytical methods ensuring the highest quality and potency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-forest">
                        {area.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-forest">
                          {area.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {area.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-forest">
                        Advanced Techniques:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {area.techniques.map((technique) => (
                          <Badge key={technique} variant="outline" className="text-sage border-sage">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Partners & Publications */}
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
              Global Research Network
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Collaborating with world-renowned institutions to advance botanical science
            </p>
          </motion.div>

          <Tabs defaultValue="partners" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="partners">Research Partners</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="partners" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {researchPartners.map((partner, index) => (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-forest">{partner.name}</CardTitle>
                        <CardDescription>{partner.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-forest">Focus: </span>
                            <span className="text-gray-700">{partner.focus}</span>
                          </div>
                          <div>
                            <span className="font-medium text-forest">Collaboration: </span>
                            <span className="text-gray-700">{partner.collaboration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="publications" className="mt-8">
              <div className="space-y-6">
                {publications.map((publication, index) => (
                  <motion.div
                    key={publication.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-forest text-lg leading-relaxed">
                          {publication.title}
                        </CardTitle>
                        <CardDescription>
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          {publication.journal} • {publication.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          <span className="font-medium">Authors: </span>
                          {publication.authors}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certifications & Standards */}
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
              Quality Certifications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rigorous standards ensuring safety, quality, and regulatory compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardHeader>
                    <Award className="w-12 h-12 mx-auto text-forest mb-2" />
                    <CardTitle className="text-lg text-forest">{cert.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </CardContent>
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
              Science-Backed Quality
            </h2>
            <p className="text-xl text-cream mb-8 leading-relaxed">
              Every RÜTZ product is backed by rigorous scientific research, 
              ensuring you receive the highest quality botanical extracts available.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-cream">500+</div>
                <div className="text-lg">Quality Tests per Batch</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">99.9%</div>
                <div className="text-lg">Purity Standards</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cream">15+</div>
                <div className="text-lg">Research Publications</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}