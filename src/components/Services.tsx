import { useQuery } from "@tanstack/react-query";
import { Truck, Package, Clock, Home, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ICON_COMPONENTS = {
  truck: Truck,
  package: Package,
  clock: Clock,
  home: Home,
  calendar: Calendar,
};

export default function Services() {
  const { toast } = useToast();
  
  const { data: services, isLoading } = useQuery({
    queryKey: ["service-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_templates")
        .select("*");

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les services",
        });
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-24 sm:py-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

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
            {services?.map((service) => {
              const IconComponent = ICON_COMPONENTS[service.icon as keyof typeof ICON_COMPONENTS] || Package;
              
              return (
                <div key={service.id} className="relative flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {service.service_type}
                  </h3>
                  <p className="mt-2 text-center text-gray-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}