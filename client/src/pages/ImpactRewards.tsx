import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunityImpactRewards from "@/components/CommunityImpactRewards";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";

export default function ImpactRewards() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        {/* RÜTZ Logo */}
        <div className="flex justify-center pb-6">
          <Logo size="lg" />
        </div>
        <CommunityImpactRewards />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}