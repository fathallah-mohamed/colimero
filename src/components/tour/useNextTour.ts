import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, RouteStop } from "@/types/tour";

export function useNextTour() {
  return useQuery({
    queryKey: ['next-planned-tour'],
    queryFn: async () => {
      try {
        console.log('Fetching next tour...');
        
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
          .eq('status', 'Programmee') // Changé de 'Programmée' à 'Programmee'
          .eq('type', 'public')
          .gte('departure_date', new Date().toISOString())
          .order('departure_date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching next tour:', error);
          throw error;
        }
        
        console.log('Next tour data:', data);
        
        if (!data) return null;
        
        // Parse route data
        const parsedRoute = Array.isArray(data.route) 
          ? data.route 
          : JSON.parse(data.route as string);

        // Transform route data
        const transformedRoute = parsedRoute.map((stop: any): RouteStop => ({
          name: stop.name,
          location: stop.location,
          time: stop.time,
          type: stop.type,
          collection_date: stop.collection_date
        }));

        // Transform carrier data
        const transformedTour = {
          ...data,
          route: transformedRoute,
          status: data.status as Tour['status'],
          carriers: {
            ...data.carriers,
            carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
              ? data.carriers.carrier_capacities[0]
              : data.carriers?.carrier_capacities
          }
        } as Tour;

        console.log('Transformed tour:', transformedTour);
        return transformedTour;
      } catch (error) {
        console.error('Error in useNextTour:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}