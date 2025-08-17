import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import PlantExplorer from "@/pages/PlantExplorer";
import UserAccount from "@/pages/UserAccount";
import OrderHistory from "@/pages/OrderHistory";
import Sourcing from "@/pages/Sourcing";
import Science from "@/pages/Science";
import Impact from "@/pages/Impact";
import About from "@/pages/About";
import PlantPairing from "@/pages/PlantPairing";
import PlantOrbit from "@/pages/PlantOrbit";
import LearningHub from "@/pages/LearningHub";
import Journey from "@/pages/Journey";
import ImpactRewards from "@/pages/ImpactRewards";
import PlantRecommendations from "@/pages/PlantRecommendations";
import ChagaPortfolio from "@/pages/ChagaPortfolio";
import HealthConcerns from "@/pages/HealthConcerns";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/plant-explorer" component={PlantExplorer} />
      <Route path="/sourcing" component={Sourcing} />
      <Route path="/science" component={Science} />
      <Route path="/impact" component={Impact} />
      <Route path="/about" component={About} />
      <Route path="/plant-pairing" component={PlantPairing} />
      <Route path="/plant-orbit" component={PlantOrbit} />
      <Route path="/learning-hub" component={LearningHub} />
      <Route path="/journey" component={Journey} />
      <Route path="/impact-rewards" component={ImpactRewards} />
      <Route path="/plant-recommendations" component={PlantRecommendations} />
      <Route path="/chaga-portfolio" component={ChagaPortfolio} />
      <Route path="/health-concerns" component={HealthConcerns} />
      <Route path="/account" component={UserAccount} />
      <Route path="/orders" component={OrderHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
