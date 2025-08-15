import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GamifiedLearningSystem from "@/components/GamifiedLearningSystem";
import CartSidebar from "@/components/CartSidebar";

export default function LearningHub() {
  return (
    <div className="font-brand bg-natural min-h-screen">
      <Header />
      <main className="pt-8">
        <GamifiedLearningSystem />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}