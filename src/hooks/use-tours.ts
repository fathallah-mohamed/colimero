import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TourStatus } from "@/types/tour";

export function useTours() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [sortBy, setSortBy] = useState("date_desc");
  const [status, setStatus] = useState<TourStatus | "all">("planned");
  const { toast } = useToast();

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
        case 'date_asc':
          query = query.order('departure_date', { ascending: true });
          break;
        case 'date_desc':
          query = query.order('departure_date', { ascending: false });
          break;
        case 'capacity_asc':
          query = query.order('remaining_capacity', { ascending: true });
          break;
        case 'capacity_desc':
          query = query.order('remaining_capacity', { ascending: false });
          break;
      }

      const { data: toursData, error: toursError } = await query;

      if (toursError) {
        console.error('Error fetching tours:', toursError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
        return;
      }

      setTours(toursData || []);
    }
    setLoading(false);
  };

  const handleDelete = async (tourId: number) => {
    const tour = tours.find(t => t.id === tourId);
    if (tour?.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être supprimées",
      });
      return;
    }

    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tournée",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La tournée a été supprimée",
    });
    fetchTours();
  };

  const handleEdit = (tour: any) => {
    if (tour.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être modifiées",
      });
      return;
    }
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async (tourId: number, newStatus: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (tour?.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Le statut des tournées terminées ne peut pas être modifié",
      });
      return;
    }

    const { error } = await supabase
      .from('tours')
      .update({ status: newStatus })
      .eq('id', tourId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return;
    }

    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, status: newStatus } : tour
    ));
  };

  const onEditComplete = () => {
    setIsEditDialogOpen(false);
    setSelectedTour(null);
    fetchTours();
  };

  return {
    loading,
    tours,
    selectedTour,
    isEditDialogOpen,
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete
  };
}