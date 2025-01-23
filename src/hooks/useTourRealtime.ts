import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tour, TourStatus, RouteStop } from '@/types/tour';
import type { Json } from '@/types/database/tables';

interface RawTourData {
  id: number;
  carrier_id: string;
  route: Json;
  total_capacity: number;
  remaining_capacity: number;
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  status: string;
  type: Tour['type'];
  previous_status: string | null;
  bookings?: any[];
  terms_accepted: boolean;
  customs_declaration: boolean;
  tour_number?: string;
  carriers?: {
    company_name: string;
    avatar_url: string;
    carrier_capacities: {
      price_per_kg: number;
    }
  };
}

const parseRouteData = (routeData: Json): RouteStop[] => {
  if (!Array.isArray(routeData)) {
    console.error('Route data is not an array:', routeData);
    return [];
  }

  return routeData.map(stop => {
    if (typeof stop !== 'object' || stop === null) {
      console.error('Invalid stop data:', stop);
      return {
        name: 'Unknown',
        location: 'Unknown',
        time: '00:00',
        type: 'pickup'
      };
    }

    return {
      name: String(stop.name || ''),
      location: String(stop.location || ''),
      time: String(stop.time || ''),
      type: (stop.type as 'pickup' | 'dropoff') || 'pickup',
      collection_date: stop.collection_date ? String(stop.collection_date) : undefined
    };
  });
};

const transformTourData = (rawData: RawTourData): Tour => {
  return {
    ...rawData,
    route: parseRouteData(rawData.route),
    status: rawData.status as TourStatus,
    previous_status: rawData.previous_status as TourStatus | null,
    bookings: rawData.bookings || [],
    terms_accepted: Boolean(rawData.terms_accepted),
    customs_declaration: Boolean(rawData.customs_declaration),
    carriers: rawData.carriers
  };
};

export function useTourRealtime(tourId: number) {
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchTour = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          carriers (
            company_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
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
            package_description
          )
        `)
        .eq('id', tourId)
        .single();

      if (error) {
        console.error('Error fetching tour:', error);
        return;
      }

      if (data) {
        setTour(transformTourData(data as RawTourData));
      }
    };

    fetchTour();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`tour_${tourId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours',
          filter: `id=eq.${tourId}`
        },
        async (payload) => {
          console.log('Received realtime update:', payload);
          if (payload.new) {
            // Fetch the complete tour data with relations
            const { data, error } = await supabase
              .from('tours')
              .select(`
                *,
                carriers (
                  company_name,
                  avatar_url,
                  carrier_capacities (
                    price_per_kg
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
                  package_description
                )
              `)
              .eq('id', tourId)
              .single();

            if (error) {
              console.error('Error fetching updated tour:', error);
              return;
            }

            if (data) {
              setTour(transformTourData(data as RawTourData));
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [tourId]);

  return tour;
}