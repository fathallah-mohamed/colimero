import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Building, Users, Shield, TrendingUp, Globe, Truck, Clock, HandShake } from "lucide-react";

export default function APropos() {
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
      icon: HandShake,
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Building className="h-12 w-12" />
              <h1 className="text-4xl font-bold">À propos de Colimero</h1>
            </div>
            <p className="text-xl max-w-3xl">
              Colimero révolutionne le transport de colis entre la France et le Maghreb 
              en connectant expéditeurs et transporteurs de confiance pour des envois 
              plus simples, plus sûrs et plus économiques.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Carriers Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Pour les transporteurs</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Rejoignez notre réseau de transporteurs et développez votre activité 
              en toute simplicité.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {carrierBenefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">+1000</div>
                <div className="text-gray-600">Colis livrés</div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">+50</div>
                <div className="text-gray-600">Transporteurs partenaires</div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">+30</div>
                <div className="text-gray-600">Villes desservies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  Colimero s'engage à simplifier et sécuriser les envois de colis entre 
                  la France et le Maghreb. Notre plateforme met en relation expéditeurs 
                  et transporteurs professionnels, garantissant des services de qualité 
                  à des prix compétitifs.
                </p>
                <p>
                  Nous innovons constamment pour offrir une expérience utilisateur 
                  optimale, que vous soyez transporteur ou expéditeur. Notre technologie 
                  permet un suivi en temps réel, une gestion simplifiée et une 
                  transparence totale.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}