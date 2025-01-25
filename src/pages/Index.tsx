import { useState } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CurrentTours from "@/components/CurrentTours";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Index() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation showAuthDialog={showAuthDialog} setShowAuthDialog={setShowAuthDialog} />
      <main>
        <Hero />
        <HowItWorks />
        <CurrentTours />
        <CarrierCTA />
        <ClientCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}