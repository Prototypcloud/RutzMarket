import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PersonalizedRecommendationEngine from "@/components/PersonalizedRecommendationEngine";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";

export default function PlantRecommendations() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        {/* RÜTZ Logo */}
        <div className="flex justify-center pb-6">
          <Logo size="lg" />
        </div>
        <PersonalizedRecommendationEngine />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}