import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TourCard } from "../TourCard";

interface TourListProps {
  status: "upcoming" | "completed";
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourList({ status, onEdit, onDelete, onStatusChange }: TourListProps) {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTours = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: toursData, error: toursError } = await supabase
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
        .order('departure_date', { ascending: true });

      if (toursError) {
        console.error('Error fetching tours:', toursError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
        return;
      }

      const filteredTours = toursData?.filter(tour => 
        status === "completed" ? tour.status === "completed" : tour.status !== "completed"
      ) || [];

      setTours(filteredTours);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, [status]);

  if (loading) return null;

  return (
    <div className="grid gap-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={status === "completed"}
        />
      ))}
    </div>
  );
}