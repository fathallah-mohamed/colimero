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
  livraison_express: Truck,
  livraison_domicile: Home,
  transport_standard: Package,
  transport_volumineux: Sofa,
  collecte_programmee: Calendar,
};

const SERVICE_NAMES = {
  livraison_express: "Livraison Express",
  livraison_domicile: "Livraison à domicile",
  transport_standard: "Transport de colis standard",
  transport_volumineux: "Transport d'objets volumineux",
  collecte_programmee: "Collecte programmée",
};

export function TransporteurServices({ services }: TransporteurServicesProps) {
  if (!services?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Services proposés</h2>
        <p className="text-center text-gray-500 py-4">
          Aucun service disponible
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Services proposés</h2>
      <div className="space-y-6">
        {services.map((service) => {
          const IconComponent = SERVICE_ICONS[service.service_type as keyof typeof SERVICE_ICONS] || Package;
          const serviceName = SERVICE_NAMES[service.service_type as keyof typeof SERVICE_NAMES] || service.service_type;

          return (
            <div key={service.id} className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#E5DEFF] flex items-center justify-center flex-shrink-0">
                <IconComponent className="h-6 w-6 text-[#00B0F0]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{serviceName}</h3>
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