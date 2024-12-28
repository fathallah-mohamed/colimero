import { Truck, Package, Clock, Shield } from "lucide-react";

const services = [
  {
    name: "Livraison Express",
    description: "Livraison rapide de vos colis en 3-5 jours ouvrés",
    icon: Truck,
  },
  {
    name: "Suivi en temps réel",
    description: "Suivez votre colis à chaque étape de son voyage",
    icon: Package,
  },
  {
    name: "Service 24/7",
    description: "Support client disponible à tout moment",
    icon: Clock,
  },
  {
    name: "Assurance incluse",
    description: "Tous vos envois sont assurés jusqu'à 500€",
    icon: Shield,
  },
];

export default function Services() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nos Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Des solutions de livraison adaptées à vos besoins
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.name} className="relative flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}