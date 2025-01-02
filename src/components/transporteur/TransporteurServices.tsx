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

const SERVICE_LABELS: { [key: string]: string } = {
  'livraison_express': 'Livraison express',
  'livraison_domicile': 'Livraison à domicile',
  'transport_standard': 'Transport standard',
  'transport_volumineux': 'Transport volumineux',
  'collecte_programmee': 'Collecte programmée'
};

const ICON_COMPONENTS = {
  truck: Truck,
  home: Home,
  package: Package,
  sofa: Sofa,
  calendar: Calendar,
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
          const IconComponent = ICON_COMPONENTS[service.icon as keyof typeof ICON_COMPONENTS] || Package;
          const serviceLabel = SERVICE_LABELS[service.service_type] || service.service_type;

          return (
            <div key={service.id} className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#E5DEFF] flex items-center justify-center flex-shrink-0">
                <IconComponent className="h-6 w-6 text-[#00B0F0]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{serviceLabel}</h3>
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