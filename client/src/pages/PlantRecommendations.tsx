import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PersonalizedRecommendationEngine from "@/components/PersonalizedRecommendationEngine";
import CartSidebar from "@/components/CartSidebar";

export default function PlantRecommendations() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        <PersonalizedRecommendationEngine />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}