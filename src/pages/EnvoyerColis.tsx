import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function EnvoyerColis() {
  const [publicTours, setPublicTours] = useState<any[]>([]);
  const [privateTours, setPrivateTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const updateTourStatus = async () => {
    const { error } = await supabase
      .from('tours')
      .update({ status: 'planned' })
      .eq('type', 'private')
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée",
      });
      console.error('Error updating tour status:', error);
      return;
    }

    toast({
      title: "Succès",
      description: "Le statut de la tournée a été mis à jour",
    });
  };

  useEffect(() => {
    updateTourStatus();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data: publicToursData, error: publicError } = await supabase
          .from("tours")
          .select(`
            *,
            carriers (
              company_name,
              avatar_url,
              carrier_capacities (
                price_per_kg
              )
            )
          `)
          .eq("type", "public")
          .gte("departure_date", new Date().toISOString())
          .order("departure_date", { ascending: true });

        const { data: privateToursData, error: privateError } = await supabase
          .from("tours")
          .select(`
            *,
            carriers (
              company_name,
              avatar_url,
              carrier_capacities (
                price_per_kg
              )
            )
          `)
          .eq("type", "private")
          .gte("departure_date", new Date().toISOString())
          .order("departure_date", { ascending: true });

        if (publicError) throw publicError;
        if (privateError) throw privateError;

        setPublicTours(publicToursData || []);
        setPrivateTours(privateToursData || []);
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [toast]);

  const handleBookingClick = (tourId: number, pickupCity: string) => {
    console.log("Booking clicked for tour:", tourId, "pickup city:", pickupCity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Envoyer un colis</h1>

        <Tabs defaultValue="public" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public">Tournées publiques</TabsTrigger>
            <TabsTrigger value="private">Tournées privées</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <TransporteurTours
                tours={publicTours}
                type="public"
                isLoading={isLoading}
                onBookingClick={handleBookingClick}
              />
            )}
          </TabsContent>

          <TabsContent value="private">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <TransporteurTours
                tours={privateTours}
                type="private"
                isLoading={isLoading}
                onBookingClick={handleBookingClick}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}