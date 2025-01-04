import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus, RouteStop } from "@/types/tour";

interface UseTourDataProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
}

interface RouteStopRaw {
  name?: string;
  location?: string;
  time?: string;
  type?: string;
  collection_date?: string;
}

export function useTourData({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
}: UseTourDataProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    checkUser();
    fetchTours();
  }, [departureCountry, destinationCountry, sortBy, status]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
  };

  const parseRoute = (route: unknown): RouteStop[] => {
    if (typeof route === 'string') {
      try {
        const parsed = JSON.parse(route) as RouteStopRaw[];
        return parsed.map(parseRouteStop);
      } catch {
        return [];
      }
    }
    if (Array.isArray(route)) {
      return route.map(parseRouteStop);
    }
    if (typeof route === 'object' && route !== null) {
      return Object.values(route as Record<string, RouteStopRaw>).map(parseRouteStop);
    }
    return [];
  };

  const parseRouteStop = (stop: RouteStopRaw): RouteStop => ({
    name: String(stop.name || ''),
    location: String(stop.location || ''),
    time: String(stop.time || ''),
    type: stop.type === 'pickup' || stop.type === 'dropoff' ? stop.type : 'pickup',
    collection_date: String(stop.collection_date || '')
  });

  const fetchTours = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
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
        .eq('carrier_id', session.user.id)
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

      const { data: toursData, error: toursError } = await query;

      if (toursError) {
        console.error('Error fetching tours:', toursError);
        return;
      }

      const transformedTours: Tour[] = (toursData || []).map(tour => ({
        ...tour,
        route: parseRoute(tour.route),
        status: tour.status as TourStatus,
        carriers: tour.carriers ? {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
            ? tour.carriers.carrier_capacities
            : [tour.carriers.carrier_capacities]
        } : null
      }));

      setTours(transformedTours);
    }
    setLoading(false);
  };

  return {
    loading,
    tours,
    fetchTours,
  };
}