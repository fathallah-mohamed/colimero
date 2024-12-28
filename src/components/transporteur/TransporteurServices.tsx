import { Package, Truck, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CarrierService {
  id: string;
  service_type: string;
}

const serviceTypeLabels: Record<string, string> = {
  'express_delivery': 'Livraison Express',
  'home_delivery': 'Livraison à domicile',
  'fragile_handling': 'Traitement spécial fragile',
  'pickup_delivery': 'Collecte et livraison à domicile'
};

const serviceTypeIcons: Record<string, typeof Truck | typeof Home | typeof Package> = {
  'express_delivery': Truck,
  'home_delivery': Home,
  'fragile_handling': Package,
  'pickup_delivery': Package
};

interface TransporteurServicesProps {
  services?: CarrierService[];
}

export function TransporteurServices({ services }: TransporteurServicesProps) {
  if (!services?.length) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Services</h2>
      <div className="space-y-4">
        {services.map((service) => {
          const IconComponent = serviceTypeIcons[service.service_type];
          return (
            <div key={service.id} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                {IconComponent && <IconComponent className="h-5 w-5 text-[#00B0F0]" />}
              </div>
              <div>
                <p className="text-gray-900">
                  {serviceTypeLabels[service.service_type] || service.service_type}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}