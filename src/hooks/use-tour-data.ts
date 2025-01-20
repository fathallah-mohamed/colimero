import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus, RouteStop } from "@/types/tour";

interface UseTourDataProps {
  departureCountry: string;
  destinationCountry: string;
  sortBy: string;
  status: TourStatus | "all";
  carrierOnly?: boolean;
}

export function useTourData({
  departureCountry,
  destinationCountry,
  sortBy,
  status,
  carrierOnly = false,
}: UseTourDataProps) {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID first
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Fetching tours with filters:', { 
        departureCountry, 
        destinationCountry, 
        sortBy, 
        status, 
        carrierOnly,
        userId: user?.id 
      });

      // If we're in carrier mode and there's no user, return empty array
      if (carrierOnly && !user) {
        console.log('No authenticated user found for carrier mode');
        setTours([]);
        setLoading(false);
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
        .eq('destination_country', destinationCountry);

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

      const { data: toursData, error } = await query;

      if (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
        return;
      }

      console.log('Fetched tours:', toursData);

      // Transform the data to match the Tour type
      const transformedTours = toursData?.map(tour => {
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
          type: tour.type,
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
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [departureCountry, destinationCountry, sortBy, status, carrierOnly]);

  return {
    loading,
    tours,
    fetchTours,
  };
}