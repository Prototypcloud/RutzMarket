import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedJourneyTracker from "@/components/AnimatedJourneyTracker";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";

export default function Journey() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        {/* RÜTZ Logo */}
        <div className="flex justify-center pb-6">
          <Logo size="lg" />
        </div>
        <AnimatedJourneyTracker />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}