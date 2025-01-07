import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Shield } from "lucide-react";

interface PlanningHeroProps {
  onCreateTourClick: () => void;
}

export function PlanningHero({ onCreateTourClick }: PlanningHeroProps) {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenus optimisés",
      description: "Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.",
    },
    {
      icon: Users,
      title: "Réseau d'expéditeurs",
      description: "Accédez à une large base de clients vérifiés prêts à expédier.",
    },
    {
      icon: Shield,
      title: "Gestion simplifiée",
      description: "Gérez facilement vos tournées et vos clients via notre plateforme intuitive.",
    },
  ];

  return (
    <div className="text-center space-y-6 py-12 mt-8">
      <h1 className="text-4xl font-bold text-[#0099FF] mb-4">
        Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
      </h1>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        Créez facilement une tournée pour vos trajets, remplissez votre véhicule et optimisez vos revenus. 
        Grâce à Colimero, vous accédez à un large réseau d'expéditeurs prêts à collaborer.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-lg p-8 shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 text-[#0099FF]">
              <benefit.icon className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Button
          onClick={onCreateTourClick}
          size="lg"
          className="bg-[#0099FF] hover:bg-[#0088EE] text-white px-8 py-6 rounded-lg text-lg"
        >
          Créer une tournée
        </Button>
        <p className="text-gray-500 text-sm">
          Vous devez être connecté pour planifier une tournée
        </p>
      </div>
    </div>
  );
}