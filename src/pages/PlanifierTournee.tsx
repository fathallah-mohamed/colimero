import Navigation from "@/components/Navigation";
import { TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PlanifierTournee() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenus optimisés",
      description:
        "Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.",
    },
    {
      icon: Users,
      title: "Réseau d'expéditeurs",
      description:
        "Accédez à une large base de clients vérifiés prêts à expédier.",
    },
    {
      icon: Shield,
      title: "Gestion simplifiée",
      description:
        "Gérez facilement vos tournées et vos clients via notre plateforme intuitive.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0091FF] mb-6">
            Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
          </h1>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Créez facilement une tournée pour vos trajets, remplissez votre
            véhicule et optimisez vos revenus. Grâce à Colimero, vous accédez à un
            large réseau d'expéditeurs prêts à collaborer.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-[#0091FF]/10 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-[#0091FF]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-[#0091FF] hover:bg-[#0091FF]/90 text-white px-8"
          >
            <Link to="/login">Créer une tournée</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Vous devez être connecté pour planifier une tournée
          </p>
        </div>
      </div>
    </div>
  );
}