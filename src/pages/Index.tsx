import { useState } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CurrentTours from "@/components/CurrentTours";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Activation from "./Activation";
import { useLocation } from "react-router-dom";

export default function Index() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();

  // Si nous sommes sur la route d'activation
  if (location.pathname === '/activation') {
    return <Activation onShowAuthDialog={() => setShowAuthDialog(true)} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        showAuthDialog={showAuthDialog} 
        setShowAuthDialog={setShowAuthDialog} 
      />
      <Hero />
      <HowItWorks />
      <CurrentTours />
      <CarrierCTA />
      <ClientCTA />
      <Testimonials />
      <Footer />
    </div>
  );
}