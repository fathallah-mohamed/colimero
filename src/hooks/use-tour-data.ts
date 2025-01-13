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
      console.log('Fetching tours with filters:', { departureCountry, destinationCountry, sortBy, status, carrierOnly });
      
      let query = supabase
        .from('tours')
        .select(`
          *,
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
          ),
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
        .eq('departure_country', departureCountry)
        .eq('destination_country', destinationCountry);

      if (carrierOnly) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('carrier_id', user.id);
        }
      }

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: toursData, error } = await query;

      if (error) {
        console.error('Error fetching tours:', error);
        return;
      }

      console.log('Fetched tours:', toursData);

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
          previous_status: tour.previous_status as TourStatus | null,
          bookings: tour.bookings?.map(booking => ({
            ...booking,
            special_items: booking.special_items || [],
            content_types: booking.content_types || [],
            terms_accepted: booking.terms_accepted || false,
            customs_declaration: booking.customs_declaration || false
          })) || [],
          carriers: tour.carriers ? {
            ...tour.carriers,
            carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
              ? tour.carriers.carrier_capacities[0]
              : tour.carriers.carrier_capacities
          } : undefined
        } as Tour;
      }) || [];

      // Appliquer le tri après la transformation
      const sortedTours = [...transformedTours].sort((a, b) => {
        switch (sortBy) {
          case 'departure_asc':
            return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
          case 'departure_desc':
            return new Date(b.departure_date).getTime() - new Date(a.departure_date).getTime();
          case 'price_asc':
            return (a.carriers?.carrier_capacities?.price_per_kg || 0) - (b.carriers?.carrier_capacities?.price_per_kg || 0);
          case 'price_desc':
            return (b.carriers?.carrier_capacities?.price_per_kg || 0) - (a.carriers?.carrier_capacities?.price_per_kg || 0);
          default:
            return 0;
        }
      });

      setTours(sortedTours);
    } catch (error) {
      console.error('Error in fetchTours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Filters changed, fetching tours...');
    fetchTours();
  }, [departureCountry, destinationCountry, sortBy, status, carrierOnly]);

  return {
    loading,
    tours,
    fetchTours,
  };
}