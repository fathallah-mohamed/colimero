import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus, RouteStop } from "@/types/tour";

interface UseTourDataProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
}

export function useTourData({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
}: UseTourDataProps) {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);

  const fetchTours = async () => {
    console.log('Fetching tours with filters:', { departureCountry, destinationCountry, sortBy, status });
    
    let query = supabase
      .from('tours')
      .select(`
        *,
        bookings (
          id,
          pickup_city,
          delivery_city,
          weight,
          tracking_number,
          status,
          recipient_name,
          recipient_phone
        ),
        carriers (
          company_name,
          avatar_url,
          carrier_capacities (
            price_per_kg
          )
        )
      `)
      .eq('departure_country', departureCountry)
      .eq('destination_country', destinationCountry);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    switch (sortBy) {
      case 'departure_asc':
        query = query.order('departure_date', { ascending: true });
        break;
      case 'departure_desc':
        query = query.order('departure_date', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tours:', error);
      return;
    }

    console.log('Fetched tours:', data);

    const transformedTours = data?.map(tour => {
      // Parse route JSON into RouteStop array
      const routeData = typeof tour.route === 'string' 
        ? JSON.parse(tour.route) 
        : tour.route;

      const parsedRoute: RouteStop[] = Array.isArray(routeData) 
        ? routeData.map(stop => ({
            name: stop.name,
            location: stop.location,
            time: stop.time,
            type: stop.type,
            collection_date: stop.collection_date
          }))
        : [];

      return {
        ...tour,
        route: parsedRoute,
        status: tour.status as TourStatus,
        previous_status: tour.previous_status as TourStatus | null,
        bookings: tour.bookings || [],
        carriers: tour.carriers ? {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
            ? tour.carriers.carrier_capacities[0]
            : tour.carriers.carrier_capacities
        } : undefined
      } as Tour;
    });

    setTours(transformedTours || []);
    setLoading(false);
  };

  useEffect(() => {
    console.log('Filters changed, fetching tours...');
    fetchTours();
  }, [departureCountry, destinationCountry, sortBy, status]);

  return {
    loading,
    tours,
    fetchTours,
  };
}