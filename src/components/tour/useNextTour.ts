import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, RouteStop } from "@/types/tour";

export function useNextTour() {
  return useQuery({
    queryKey: ['next-planned-tour'],
    queryFn: async () => {
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
        .eq('status', 'planned')
        .eq('type', 'public')
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
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
          carriers: {
            ...data.carriers,
            carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
              ? data.carriers.carrier_capacities 
              : [data.carriers?.carrier_capacities]
          }
        } as Tour;
      }
      return null;
    },
  });
}