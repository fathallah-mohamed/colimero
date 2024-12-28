import { Card } from "@/components/ui/card";
import { Truck, Home, Package, Sofa, Calendar } from "lucide-react";

interface Service {
  id: string;
  service_type: string;
  description?: string;
  icon: string;
}

interface TransporteurServicesProps {
  services: Service[];
}

const SERVICE_ICONS = {
  express_delivery: Truck,
  home_delivery: Home,
  standard_delivery: Package,
  large_items_delivery: Sofa,
  scheduled_pickup: Calendar,
};

const SERVICE_NAMES = {
  express_delivery: "Livraison Express",
  home_delivery: "Livraison à domicile",
  standard_delivery: "Transport de colis standard",
  large_items_delivery: "Transport d'objets volumineux",
  scheduled_pickup: "Collecte programmée",
};

export function TransporteurServices({ services }: TransporteurServicesProps) {
  if (!services?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Services</h2>
        <p className="text-center text-gray-500 py-4">
          Aucun service disponible
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Services</h2>
      <div className="space-y-4">
        {services.map((service) => {
          const IconComponent = SERVICE_ICONS[service.service_type as keyof typeof SERVICE_ICONS] || Package;
          const serviceName = SERVICE_NAMES[service.service_type as keyof typeof SERVICE_NAMES] || service.service_type;

          return (
            <div key={service.id} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center flex-shrink-0">
                <IconComponent className="h-5 w-5 text-[#00B0F0]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{serviceName}</p>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}