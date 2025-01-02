import { Building, Users, Shield, TrendingUp, Globe, Truck, Clock, Handshake } from "lucide-react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CurrentTours from "@/components/CurrentTours";
import CarrierCTA from "@/components/CarrierCTA";
import ClientCTA from "@/components/ClientCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Index() {
  const companyValues = [
    {
      icon: Shield,
      title: "Sécurité et fiabilité",
      description: "Vos colis sont entre de bonnes mains avec nos transporteurs vérifiés et notre système de suivi en temps réel."
    },
    {
      icon: Globe,
      title: "Réseau international",
      description: "Une présence établie en France et au Maghreb, avec un réseau de transporteurs de confiance."
    },
    {
      icon: Clock,
      title: "Efficacité",
      description: "Des délais optimisés et une gestion simplifiée de vos expéditions."
    },
    {
      icon: Handshake,
      title: "Partenariat",
      description: "Une relation de confiance avec nos transporteurs et nos clients."
    }
  ];

  const carrierBenefits = [
    {
      icon: TrendingUp,
      title: "Optimisez vos revenus",
      description: "Maximisez la rentabilité de vos trajets en complétant votre chargement."
    },
    {
      icon: Users,
      title: "Clientèle qualifiée",
      description: "Accédez à une base de clients vérifiés et prêts à expédier."
    },
    {
      icon: Truck,
      title: "Flexibilité totale",
      description: "Gérez vos tournées selon vos disponibilités et votre zone de couverture."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      
      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building className="h-8 w-8 text-[#00B0F0]" />
              <h2 className="text-3xl font-bold text-gray-900">Notre mission</h2>
            </div>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Colimero révolutionne le transport de colis entre la France et le Maghreb 
              en connectant expéditeurs et transporteurs de confiance pour des envois 
              plus simples, plus sûrs et plus économiques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {companyValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:-translate-y-1"
              >
                <div className="bg-[#00B0F0]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-[#00B0F0]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {carrierBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:-translate-y-1"
              >
                <div className="bg-[#00B0F0]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-[#00B0F0]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-[#00B0F0] mb-2">+1000</div>
              <div className="text-gray-600">Colis livrés</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-[#00B0F0] mb-2">+50</div>
              <div className="text-gray-600">Transporteurs partenaires</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-[#00B0F0] mb-2">+30</div>
              <div className="text-gray-600">Villes desservies</div>
            </div>
          </div>
        </div>
      </section>

      <CurrentTours />
      <CarrierCTA />
      <ClientCTA />
      <Testimonials />
      <Footer />
    </div>
  );
}