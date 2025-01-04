import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus } from "@/types/tour";

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
          )
        `)
        .eq('carrier_id', session.user.id)
        .eq('departure_country', departureCountry)
        .eq('destination_country', destinationCountry);

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply sorting
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

      setTours(toursData || []);
    }
    setLoading(false);
  };

  return {
    loading,
    tours,
    fetchTours,
  };
}