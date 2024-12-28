import { Truck, Package, Clock, Home, Calendar } from "lucide-react";

const services = [
  {
    name: "Transport standard",
    description: "Transport standard de vos colis",
    icon: Truck,
  },
  {
    name: "Transport volumineux",
    description: "Pour vos colis volumineux et lourds",
    icon: Package,
  },
  {
    name: "Livraison express",
    description: "Livraison rapide garantie",
    icon: Clock,
  },
  {
    name: "Livraison à domicile",
    description: "Livraison directement chez vous",
    icon: Home,
  },
  {
    name: "Collecte programmée",
    description: "Collecte à une date programmée",
    icon: Calendar,
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
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
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