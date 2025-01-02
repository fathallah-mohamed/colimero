import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BookingStatus, BookingFilterStatus } from "@/types/booking";

export function useTourBookings(tourId: number) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<BookingFilterStatus>('all');
  const [selectedSort, setSelectedSort] = useState('date_desc');
  const { toast } = useToast();

  const fetchBookings = async () => {
    console.log("Fetching bookings for tour:", tourId);
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        tours (
          departure_date,
          destination_country,
          carriers (
            company_name,
            avatar_url
          )
        )
      `)
      .eq("tour_id", tourId);

    if (error) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les réservations",
      });
      return;
    }

    console.log("Bookings fetched:", data);
    setBookings(data || []);
  };

  useEffect(() => {
    fetchBookings();
  }, [tourId]);

  const cities = useMemo(() => {
    const uniqueCities = new Set(bookings.map(b => b.delivery_city));
    return Array.from(uniqueCities).filter(Boolean);
  }, [bookings]);

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings];

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(b => b.delivery_city === selectedCity);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    return filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'city_asc':
          return (a.delivery_city || '').localeCompare(b.delivery_city || '');
        case 'city_desc':
          return (b.delivery_city || '').localeCompare(a.delivery_city || '');
        case 'status_asc':
          return (a.status || '').localeCompare(b.status || '');
        case 'status_desc':
          return (b.status || '').localeCompare(a.status || '');
        default:
          return 0;
      }
    });
  }, [bookings, selectedCity, selectedStatus, selectedSort]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    console.log("Status change requested:", bookingId, newStatus);
    await fetchBookings();
  };

  return {
    bookings: filteredAndSortedBookings,
    cities,
    selectedCity,
    selectedStatus,
    selectedSort,
    setSelectedCity,
    setSelectedStatus,
    setSelectedSort,
    handleStatusChange,
    fetchBookings
  };
}