import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunityImpactRewards from "@/components/CommunityImpactRewards";
import CartSidebar from "@/components/CartSidebar";

export default function ImpactRewards() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        <CommunityImpactRewards />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}