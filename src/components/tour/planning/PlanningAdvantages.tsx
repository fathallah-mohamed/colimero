import { BarChart3, Clock, Users, Target } from "lucide-react";

const advantages = [
  {
    icon: BarChart3,
    title: "Maximisez vos revenus",
    points: [
      "Chargez vos véhicules à l'aller comme au retour",
      "Recevez des demandes d'expédition avant même de démarrer"
    ]
  },
  {
    icon: Clock,
    title: "Gagnez du temps",
    points: [
      "Restez le moins longtemps possible en attente",
      "Repartez chargé rapidement pour multiplier les allers-retours"
    ]
  },
  {
    icon: Users,
    title: "Un réseau fiable",
    points: [
      "Connectez-vous à une base d'expéditeurs prêts à collaborer",
      "Choisissez les demandes qui s'adaptent à votre trajet et vos capacités"
    ]
  },
  {
    icon: Target,
    title: "Planification simplifiée",
    points: [
      "Créez des tournées adaptées à vos trajets, en seulement quelques clics",
      "Suivez vos demandes et vos expéditions depuis un tableau de bord intuitif"
    ]
  }
];

export function PlanningAdvantages() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Les avantages de planifier une tournée
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <advantage.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">{advantage.title}</h3>
              <ul className="space-y-2">
                {advantage.points.map((point, idx) => (
                  <li key={idx} className="text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}