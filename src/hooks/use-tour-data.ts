import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus } from "@/types/tour";

interface UseTourDataProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
  carrierOnly?: boolean;
  tourType: "public" | "private";
}

export function useTourData({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
  carrierOnly = false,
  tourType
}: UseTourDataProps) {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current user's ID first
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Fetching tours with filters:', { 
        departureCountry, 
        destinationCountry, 
        sortBy, 
        status, 
        carrierOnly,
        tourType,
        userId: user?.id 
      });

      // If we're in carrier mode and there's no user, return empty array
      if (carrierOnly && !user) {
        console.log('No authenticated user found for carrier mode');
        setTours([]);
        return;
      }

      let query = supabase
        .from('tours')
        .select(`
          *,
          carriers (
            *,
            carrier_capacities (
              *
            )
          ),
          bookings (
            id,
            user_id,
            tour_id,
            pickup_city,
            delivery_city,
            weight,
            tracking_number,
            status,
            recipient_name,
            recipient_phone,
            recipient_address,
            item_type,
            sender_name,
            sender_phone,
            special_items,
            content_types,
            package_description,
            created_at,
            updated_at,
            terms_accepted,
            customs_declaration
          )
        `)
        .eq('departure_country', departureCountry)
        .eq('destination_country', destinationCountry)
        .eq('type', tourType);

      // Only apply carrier filter if we're in carrier mode and have a valid user
      if (carrierOnly && user) {
        console.log('Filtering for carrier:', user.id);
        query = query.eq('carrier_id', user.id);
      }

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const [sortField, sortDirection] = sortBy.split('_');
      query = query.order(sortField === 'created' ? 'created_at' : 'departure_date', { ascending: sortDirection === 'asc' });

      const { data: toursData, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching tours:', fetchError);
        setError(fetchError);
        setTours([]);
        return;
      }

      console.log('Fetched tours:', toursData);

      const transformedTours = toursData?.map(tour => {
        const routeData = typeof tour.route === 'string' 
          ? JSON.parse(tour.route) 
          : tour.route;

        return {
          ...tour,
          route: routeData,
          carriers: tour.carriers ? {
            ...tour.carriers,
            carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
              ? tour.carriers.carrier_capacities[0]
              : tour.carriers.carrier_capacities
          } : undefined,
          bookings: tour.bookings?.map(booking => ({
            ...booking,
            special_items: booking.special_items || [],
            content_types: booking.content_types || [],
            terms_accepted: booking.terms_accepted || false,
            customs_declaration: booking.customs_declaration || false
          })) || []
        } as Tour;
      }) || [];

      setTours(transformedTours);
    } catch (error) {
      console.error('Error in fetchTours:', error);
      setError(error as Error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [departureCountry, destinationCountry, sortBy, status, carrierOnly, tourType]);

  return {
    loading,
    tours,
    error
  };
}