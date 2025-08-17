import { useEffect, useState } from "react";
import { useSearch, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PersonalizedRecommendationEngine from "@/components/PersonalizedRecommendationEngine";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Brain, Activity } from "lucide-react";

// Health concerns data (matching the HealthConcerns page)
const healthConcernsData = {
  "digestive-gut": {
    name: "Digestive & Gut Health",
    description: "Probiotics, enzymes, bloating/IBS, reflux support",
    icon: <Activity className="w-6 h-6" />,
    color: "bg-green-500",
    keywords: ["probiotics", "enzymes", "bloating", "IBS", "reflux", "gut", "digestion"]
  },
  "cardiovascular": {
    name: "Cardiovascular Health", 
    description: "Heart health, blood pressure, circulation support",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-red-500",
    keywords: ["heart", "blood pressure", "circulation", "cholesterol", "cardiovascular"]
  },
  "brain-cognitive": {
    name: "Brain & Cognitive Support",
    description: "Memory, focus, mental clarity, neuroprotection",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-indigo-500",
    keywords: ["brain", "memory", "focus", "cognitive", "mental clarity", "nootropic"]
  }
  // Add more as needed
};

export default function PlantRecommendations() {
  const searchString = useSearch();
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const concern = params.get('concern');
    if (concern && healthConcernsData[concern as keyof typeof healthConcernsData]) {
      setSelectedConcern(concern);
    }
  }, [searchString]);

  const concernData = selectedConcern ? healthConcernsData[selectedConcern as keyof typeof healthConcernsData] : null;

  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        {/* RÜTZ Logo */}
        <div className="flex justify-center pb-6">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Health Concern Header (if accessed via Health Concerns) */}
        {concernData && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Link href="/health-concerns">
                    <Button variant="ghost" size="sm" className="mb-4">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Health Concerns
                    </Button>
                  </Link>
                  <Badge className="bg-botanical-gold text-forest">
                    AI Enhanced Recommendations
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${concernData.color} text-white`}>
                    {concernData.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-forest mb-2">
                      {concernData.name}
                    </CardTitle>
                    <p className="text-gray-600">
                      {concernData.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-sage/10 p-4 rounded-lg border-l-4 border-sage">
                  <p className="text-sm text-gray-700">
                    <strong>Indigenous Wisdom Integration:</strong> Our recommendations combine traditional 
                    knowledge from Indigenous communities with modern scientific research to provide 
                    personalized botanical solutions for your {concernData.name.toLowerCase()} needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <PersonalizedRecommendationEngine concernContext={concernData} />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}