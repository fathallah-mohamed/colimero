import { Card } from "@/components/ui/card";
import { Package, Truck, Home, Sofa, Laptop, TShirt } from "lucide-react";

interface Service {
  id: string;
  service_type: string;
  description?: string;
  icon: string;
}

interface TransporteurServicesProps {
  services: Service[];
}

const SERVICE_ICONS: { [key: string]: any } = {
  'transport_standard': Package,
  'transport_volumineux': Sofa,
  'livraison_express': Truck,
  'livraison_domicile': Home,
  'electronique': Laptop,
  'vetements': TShirt,
};

const SERVICE_LABELS: { [key: string]: string } = {
  'transport_standard': 'Colis standards',
  'transport_volumineux': 'Meubles',
  'livraison_express': 'Livraison Express',
  'livraison_domicile': 'Collecte & Livraison à Domicile',
  'electronique': 'Électronique',
  'vetements': 'Vêtements',
};

export function TransporteurServices({ services }: TransporteurServicesProps) {
  if (!services?.length) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Services et Capacités</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Types d'objets acceptés</h3>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => {
              const IconComponent = SERVICE_ICONS[service.service_type] || Package;
              const serviceLabel = SERVICE_LABELS[service.service_type] || service.service_type;

              return (
                <div key={service.id} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-[#00B0F0]" />
                  </div>
                  <span className="text-sm text-gray-700">{serviceLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Services additionnels</h3>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
              <Home className="h-4 w-4 text-[#00B0F0]" />
            </div>
            <span className="text-sm text-gray-700">Collecte & Livraison à Domicile</span>
          </div>
        </div>
      </div>
    </Card>
  );
}