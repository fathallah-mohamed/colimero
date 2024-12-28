import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Advantages from "@/components/Advantages";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Advantages />
      <Pricing />
      <Footer />
    </div>
  );
}