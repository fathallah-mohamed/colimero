import { Card } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  service_type: string;
  description?: string;
  icon: string;
}

interface TransporteurServicesProps {
  services: Service[];
}

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
          const IconComponent = (LucideIcons as any)[
            service.icon.charAt(0).toUpperCase() + service.icon.slice(1)
          ] || LucideIcons.Package;

          return (
            <div key={service.id} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-[#00B0F0]" />
              </div>
              <div>
                <p className="text-gray-900">
                  {service.description || service.service_type}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}