import { CheckCircle } from "lucide-react";

const advantages = [
  "Prix compétitifs garantis",
  "Réseau de distribution étendu",
  "Prise en charge à domicile",
  "Dédouanement simplifié",
  "Service client dédié",
  "Emballage sécurisé",
];

export default function Advantages() {
  return (
    <div className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pourquoi choisir Colimero ?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Des avantages exclusifs pour une expérience de livraison optimale
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {advantages.map((advantage) => (
              <div key={advantage} className="flex items-center gap-x-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}