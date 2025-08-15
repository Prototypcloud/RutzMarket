import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Award, Globe, MapPin, Calendar } from "lucide-react";

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
    name: "Dr. Sarah Running Bear",
    role: "Founder & CEO",
    background: "Anishinaabe heritage, PhD in Ethnobotany",
    focus: "Indigenous partnership development"
  },
  {
    name: "Dr. Klaus Weber",
    role: "Chief Science Officer",
    background: "Former Fraunhofer researcher, 15+ years botanical extraction",
    focus: "Advanced extraction technologies"
  },
  {
    name: "Maria Santos",
    role: "Head of Sustainability",
    background: "Environmental science, carbon management expertise",
    focus: "Environmental impact and sustainability"
  },
  {
    name: "Tom Blackstone",
    role: "Head of Community Relations",
    background: "Métis heritage, community development specialist",
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
    year: "2024",
    award: "Indigenous Business Award",
    organization: "Canadian Council for Aboriginal Business"
  },
  {
    year: "2023",
    award: "Sustainability Excellence Award",
    organization: "Natural Health Products Association"
  },
  {
    year: "2023",
    award: "Innovation in Extraction Technology",
    organization: "International Botanical Congress"
  },
  {
    year: "2022",
    award: "Ethical Business Practices Award",
    organization: "B Corp Certification"
  }
];

export default function About() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      
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