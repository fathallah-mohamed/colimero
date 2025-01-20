import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { Advantages } from "@/components/Advantages";
import { Testimonials } from "@/components/Testimonials";
import { CarrierCTA } from "@/components/CarrierCTA";
import { ClientCTA } from "@/components/ClientCTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Advantages />
        <Testimonials />
        <CarrierCTA />
        <ClientCTA />
      </main>
      <Footer />
    </div>
  );
}