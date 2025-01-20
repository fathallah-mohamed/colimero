import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransporteurAvatar } from "./TransporteurAvatar";

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'MA': 'Maroc',
  'DZ': 'Algérie'
};

export function TransporteurList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: carriers, isLoading, error } = useQuery({
    queryKey: ["carriers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select(`
          *,
          carrier_capacities (
            total_capacity,
            price_per_kg,
            offers_home_delivery
          ),
          carrier_services (
            service_type,
            icon
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les transporteurs",
        });
        throw error;
      }

      return data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Une erreur est survenue lors du chargement des transporteurs.</p>
      </div>
    );
  }

  if (!carriers || carriers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun transporteur disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="grid gap-6">
        {carriers?.map((carrier) => (
          <motion.div
            key={carrier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16">
                    <TransporteurAvatar
                      avatarUrl={carrier.avatar_url}
                      companyName={carrier.company_name || `${carrier.first_name} ${carrier.last_name}`}
                      size="md"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {carrier.company_name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>
                          {carrier.coverage_area?.map(code => countryNames[code] || code).join(" ↔ ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span>{carrier.phone}</span>
                      </div>
                      {carrier.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{carrier.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/transporteurs/${carrier.id}`)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Voir le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}