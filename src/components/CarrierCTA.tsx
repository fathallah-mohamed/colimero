import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarrierCTA() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenus optimisés",
      description: "Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.",
    },
    {
      icon: Users,
      title: "Réseau d'expéditeurs",
      description: "Accédez à une base de clients vérifiés prêts à expédier.",
    },
    {
      icon: Shield,
      title: "Gestion simplifiée",
      description: "Gérez facilement vos tournées et vos clients via notre plateforme intuitive.",
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Créez facilement une tournée pour vos trajets, remplissez votre véhicule et optimisez vos revenus. 
          Grâce à Colimero, vous accédez à un large réseau d'expéditeurs prêts à collaborer.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg">
              <div className="bg-blue-50 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Link to="/planifier-tournee">Commencer maintenant</Link>
          </Button>
          <div className="block sm:inline-block sm:ml-4">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="/profil">Mon compte</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}