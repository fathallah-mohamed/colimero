import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CurrentTours from "@/components/CurrentTours";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
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