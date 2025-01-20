import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TransporteurAvatar } from "./TransporteurAvatar";

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'MA': 'Maroc',
  'DZ': 'Algérie'
};

interface TransporteurListProps {
  searchTerm: string;
  sortBy: string;
  filterCountry: string;
}

export function TransporteurList({ searchTerm, sortBy, filterCountry }: TransporteurListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: carriers, isLoading } = useQuery({
    queryKey: ["carriers", searchTerm, sortBy, filterCountry],
    queryFn: async () => {
      let query = supabase
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
        .eq('status', 'active');

      // Apply filters
      if (filterCountry !== 'all') {
        query = query.contains('coverage_area', [filterCountry]);
      }

      if (searchTerm) {
        query = query.or(`
          company_name.ilike.%${searchTerm}%,
          first_name.ilike.%${searchTerm}%,
          last_name.ilike.%${searchTerm}%
        `);
      }

      // Apply sorting
      switch (sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'deliveries':
          query = query.order('total_deliveries', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

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
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des transporteurs...</p>
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
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        {carrier.coverage_area?.map(code => countryNames[code] || code).join(" ↔ ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{carrier.phone}</span>
                    </div>
                    {carrier.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{carrier.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/transporteurs/${carrier.id}`)}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Voir le profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}