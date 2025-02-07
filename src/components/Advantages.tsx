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
    <div className="bg-secondary py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pourquoi choisir Colimero ?
          </h2>
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {advantages.map((advantage) => (
              <div key={advantage} className="flex items-center gap-x-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm text-gray-700 truncate">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}