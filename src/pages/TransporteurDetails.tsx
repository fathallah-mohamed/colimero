import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tour } from "@/types/tour";
import Navigation from "@/components/Navigation";
import TransporteurHeader from "@/components/transporteur/TransporteurHeader";
import TransporteurLayout from "@/components/transporteur/TransporteurLayout";
import { useToast } from "@/hooks/use-toast";

export default function TransporteurDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [upcomingTours, setUpcomingTours] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data: toursData, error: toursError } = await supabase
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
          .eq('carrier_id', id)
          .order('departure_date', { ascending: false });

        if (toursError) throw toursError;

        const transformedTours = toursData.map(tour => ({
          ...tour,
          terms_accepted: tour.terms_accepted || false,
          customs_declaration: tour.customs_declaration || false,
        })) as Tour[];

        const now = new Date();
        const upcoming = transformedTours.filter(
          tour => new Date(tour.departure_date) > now
        );

        setTours(transformedTours);
        setUpcomingTours(upcoming);
      } catch (error) {
        console.error('Error fetching tours:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTours();
    }
  }, [id, toast]);

  return (
    <TransporteurLayout>
      <Navigation />
      <TransporteurHeader />
      <div className="p-4">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold">Mes Tournées</h2>
            {tours.length === 0 ? (
              <p>Aucune tournée trouvée.</p>
            ) : (
              <ul>
                {tours.map(tour => (
                  <li key={tour.id}>
                    <h3>{tour.departure_country} à {tour.destination_country}</h3>
                    <p>Date de départ: {new Date(tour.departure_date).toLocaleDateString()}</p>
                    <p>Capacité totale: {tour.total_capacity}</p>
                    <p>Capacité restante: {tour.remaining_capacity}</p>
                    <p>Termes acceptés: {tour.terms_accepted ? "Oui" : "Non"}</p>
                    <p>Déclaration douanière: {tour.customs_declaration ? "Oui" : "Non"}</p>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="text-2xl font-semibold">Tournées à venir</h2>
            {upcomingTours.length === 0 ? (
              <p>Aucune tournée à venir.</p>
            ) : (
              <ul>
                {upcomingTours.map(tour => (
                  <li key={tour.id}>
                    <h3>{tour.departure_country} à {tour.destination_country}</h3>
                    <p>Date de départ: {new Date(tour.departure_date).toLocaleDateString()}</p>
                    <p>Capacité totale: {tour.total_capacity}</p>
                    <p>Capacité restante: {tour.remaining_capacity}</p>
                    <p>Termes acceptés: {tour.terms_accepted ? "Oui" : "Non"}</p>
                    <p>Déclaration douanière: {tour.customs_declaration ? "Oui" : "Non"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </TransporteurLayout>
  );
}
