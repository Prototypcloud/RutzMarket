import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlantOrbitVisualization from "@/components/PlantOrbitVisualization";
import CartSidebar from "@/components/CartSidebar";

export default function PlantOrbit() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main>
        <PlantOrbitVisualization />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}