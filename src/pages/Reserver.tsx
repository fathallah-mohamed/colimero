import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Tour, RouteStop } from "@/types/tour";

export default function Reserver() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nextTour, setNextTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextTour = async () => {
      try {
        const { data, error } = await supabase
          .from('tours')
          .select(`
            *,
            carriers (
              company_name,
              first_name,
              last_name,
              avatar_url,
              carrier_capacities (
                price_per_kg
              )
            )
          `)
          .eq('status', 'Programmé')
          .eq('type', 'public')
          .gte('departure_date', new Date().toISOString())
          .order('departure_date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Parse and transform the route data
          const parsedRoute = Array.isArray(data.route) 
            ? data.route 
            : JSON.parse(data.route as string);

          const transformedRoute = parsedRoute.map((stop: any): RouteStop => ({
            name: stop.name,
            location: stop.location,
            time: stop.time,
            type: stop.type,
            collection_date: stop.collection_date
          }));

          setNextTour({
            ...data,
            route: transformedRoute,
            terms_accepted: data.terms_accepted || false,
            customs_declaration: data.customs_declaration || false,
            carriers: {
              ...data.carriers,
              carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
                ? data.carriers.carrier_capacities[0] 
                : data.carriers?.carrier_capacities
            }
          } as Tour);
        }
      } catch (error) {
        console.error('Error fetching next tour:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la prochaine tournée",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNextTour();
  }, [toast]);

  return (
    <div>
      <Navigation />
      {loading ? (
        <div>Chargement...</div>
      ) : nextTour ? (
        <div>
          <h1>Détails de la prochaine tournée</h1>
          <p>Pays de départ: {nextTour.departure_country}</p>
          <p>Pays de destination: {nextTour.destination_country}</p>
          <p>Date de départ: {nextTour.departure_date}</p>
          <p>Capacité totale: {nextTour.total_capacity}</p>
          <p>Capacité restante: {nextTour.remaining_capacity}</p>
          <p>Termes acceptés: {nextTour.terms_accepted ? "Oui" : "Non"}</p>
          <p>Déclaration douanière: {nextTour.customs_declaration ? "Oui" : "Non"}</p>
        </div>
      ) : (
        <div>Aucune tournée à venir.</div>
      )}
    </div>
  );
}