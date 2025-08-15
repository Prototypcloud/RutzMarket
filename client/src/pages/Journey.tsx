import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedJourneyTracker from "@/components/AnimatedJourneyTracker";
import CartSidebar from "@/components/CartSidebar";

export default function Journey() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        <AnimatedJourneyTracker />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}