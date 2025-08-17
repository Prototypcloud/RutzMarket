import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlantOrbitVisualization from "@/components/PlantOrbitVisualization";
import CartSidebar from "@/components/CartSidebar";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";

export default function PlantOrbit() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main>
        {/* RÜTZ Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>
        <PlantOrbitVisualization />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}