import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Advantages from "@/components/Advantages";
import Testimonials from "@/components/Testimonials";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import { TestEmailButton } from "@/components/auth/TestEmailButton";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto p-4">
          <TestEmailButton />
        </div>
        <Services />
        <HowItWorks />
        <Advantages />
        <Testimonials />
        <CarrierCTA />
        <ClientCTA />
      </main>
    </div>
  );
}