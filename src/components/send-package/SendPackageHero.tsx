import { Button } from "@/components/ui/button";
import { Package2, Users, Shield } from "lucide-react";

interface SendPackageHeroProps {
  isAuthenticated: boolean;
  onSendPackageClick: () => void;
  onAuthClick: () => void;
}

export function SendPackageHero({ 
  isAuthenticated,
  onSendPackageClick,
  onAuthClick 
}: SendPackageHeroProps) {
  const benefits = [
    {
      icon: Package2,
      title: "Envoi simplifié",
      description: "Envoyez vos colis facilement vers la Tunisie avec un suivi en temps réel.",
    },
    {
      icon: Users,
      title: "Réseau de transporteurs",
      description: "Accédez à un large réseau de transporteurs vérifiés et fiables.",
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Vos colis sont assurés et suivis tout au long de leur trajet.",
    },
  ];

  return (
    <div className="text-center space-y-6 py-12 mt-8">
      <h1 className="text-4xl font-bold text-[#0099FF] mb-4">
        Envoyez vos colis vers la Tunisie en toute simplicité !
      </h1>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        Profitez de notre réseau de transporteurs vérifiés pour envoyer vos colis en toute sécurité. 
        Grâce à Colimero, vous bénéficiez d'un service fiable et d'un suivi en temps réel.
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
          onClick={onSendPackageClick}
          size="lg"
          className="bg-[#0099FF] hover:bg-[#0088EE] text-white px-8 py-6 rounded-lg text-lg"
        >
          Envoyer un colis
        </Button>
        {!isAuthenticated && (
          <p className="text-gray-500 text-sm">
            Vous devez être connecté pour envoyer un colis
          </p>
        )}
      </div>
    </div>
  );
}