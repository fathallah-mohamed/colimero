import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CurrentTours from "@/components/CurrentTours";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
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