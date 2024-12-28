import { Search, Package, Truck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Trouvez votre tournée",
      description:
        "Sélectionnez la tournée qui correspond à vos besoins parmi nos transporteurs certifiés avec des départs réguliers.",
    },
    {
      icon: Package,
      title: "Réservez facilement",
      description:
        "Effectuez votre réservation en quelques clicks et recevez instantanément votre confirmation et numéro de suivi.",
    },
    {
      icon: Truck,
      title: "Suivez votre colis",
      description:
        "Restez informé en temps réel de l'acheminement de votre colis jusqu'à sa livraison finale.",
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Expédiez vos colis en toute simplicité en suivant ces trois étapes
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}