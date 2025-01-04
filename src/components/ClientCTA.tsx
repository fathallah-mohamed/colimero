import { Button } from "@/components/ui/button";
import { Shield, Eye, Layout } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClientCTA() {
  const features = [
    {
      icon: Shield,
      title: "Transporteurs vérifiés",
      description: "Tous nos transporteurs sont soigneusement sélectionnés et vérifiés.",
    },
    {
      icon: Eye,
      title: "Suivi en temps réel",
      description: "Suivez vos colis à chaque étape de leur voyage.",
    },
    {
      icon: Layout,
      title: "Plateforme intuitive",
      description: "Une interface simple pour gérer vos expéditions facilement.",
    },
  ];

  return (
    <div className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Vous avez des colis à expédier ? On s'occupe de tout !
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-50 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center space-x-4">
          <Button asChild size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/envoyer-un-colis">Expédier maintenant</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link to="/profil">Mon compte</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}