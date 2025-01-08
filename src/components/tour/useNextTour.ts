import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, RouteStop } from "@/types/tour";

export function useNextTour() {
  return useQuery({
    queryKey: ['next-planned-tour'],
    queryFn: async () => {
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

        if (error) {
          console.error('Error fetching next tour:', error);
          throw error;
        }
        
        if (!data) return null;
        
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

        return {
          ...data,
          route: transformedRoute,
          status: data.status as Tour['status'],
          terms_accepted: data.terms_accepted || false,
          customs_declaration: data.customs_declaration || false,
          carriers: {
            ...data.carriers,
            carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
              ? data.carriers.carrier_capacities 
              : [data.carriers?.carrier_capacities]
          }
        } as Tour;
      } catch (error) {
        console.error('Error in useNextTour:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
  });
}