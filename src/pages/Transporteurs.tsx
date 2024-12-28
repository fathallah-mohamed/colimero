import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, User, Package, Search, Star, TrendingUp, ShieldCheck, MessageCircle, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function Transporteurs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
          ),
          carrier_services (
            service_type
          )
        `);

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

  const stats = [
    {
      icon: Star,
      value: "98%",
      label: "satisfaction client",
    },
    {
      icon: Package,
      value: "5000+",
      label: "colis transportés",
    },
    {
      icon: MapPin,
      value: "30+",
      label: "villes couvertes",
    },
  ];

  const reasons = [
    {
      icon: ShieldCheck,
      title: "Fiabilité",
      description: "Chaque transporteur est vérifié avant d'être ajouté à notre plateforme.",
    },
    {
      icon: Award,
      title: "Expérience",
      description: "Des années d'expérience dans le transport de colis variés.",
    },
    {
      icon: MessageCircle,
      title: "Transparence",
      description: "Avis clients visibles et possibilité de contacter chaque transporteur directement.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nos Transporteurs de Confiance
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Découvrez les professionnels qui rendent vos expéditions simples et sécurisées. 
            Chaque transporteur est soigneusement sélectionné pour garantir une expérience de qualité.
          </p>
        </div>
      </div>

      {/* Global Presentation */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-xl text-gray-700 mb-12">
            Chez Colimero, nous collaborons avec des transporteurs expérimentés qui assurent 
            vos livraisons en toute sécurité entre la France, la Tunisie, et au-delà.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-lg shadow-sm"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carriers List */}
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center">Chargement des transporteurs...</div>
            ) : (
              carriers?.map((carrier) => (
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
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          {carrier.avatar_url ? (
                            <img
                              src={carrier.avatar_url}
                              alt={carrier.company_name}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {carrier.company_name}
                            </h3>
                            <div className="flex items-center text-yellow-400">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">4.8/5</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span>France ↔ Tunisie</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-blue-500" />
                              <span>{carrier.phone}</span>
                            </div>
                            {carrier.carrier_services?.map((service, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-500" />
                                <span>{service.service_type}</span>
                              </div>
                            ))}
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
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Why Choose Our Carriers */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Pourquoi choisir nos transporteurs ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-lg shadow-sm"
              >
                <reason.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <p className="text-xl text-gray-700 mb-8">
            Besoin d'un transporteur pour vos expéditions ? 
            Explorez notre réseau et réservez en quelques clics !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Search className="mr-2 h-5 w-5" />
              Trouver un transporteur
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Link to="/planifier">
                <TrendingUp className="mr-2 h-5 w-5" />
                Devenir transporteur
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}