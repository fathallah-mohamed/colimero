import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, User, Package, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, Link } from "react-router-dom";

export default function Transporteurs() {
  const navigate = useNavigate();
  
  const { data: carriers, isLoading } = useQuery({
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
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Bannière avec le même style que Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nos Transporteurs
          </h1>
          <p className="text-lg text-gray-100 mb-8">
            Découvrez nos transporteurs de confiance pour vos envois
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link to="/envoyer" className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Envoyer un colis
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link to="/planifier" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Planifier une tournée
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center">Chargement des transporteurs...</div>
            ) : (
              carriers?.map((carrier) => (
                <Card key={carrier.id} className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {carrier.avatar_url ? (
                          <img
                            src={carrier.avatar_url}
                            alt={carrier.company_name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {carrier.company_name}
                          </h3>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{carrier.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{carrier.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/transporteurs/${carrier.id}`)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Voir le profil
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Voir les tournées
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}