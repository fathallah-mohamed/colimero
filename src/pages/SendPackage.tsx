import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";

export default function SendPackage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page.",
        });
        navigate("/");
        return;
      }

      const userType = session.user.user_metadata.user_type;
      if (userType !== "client") {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux clients.",
        });
        navigate("/");
      }

      // Fetch the first available tour for testing
      const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'planned')
        .limit(1)
        .single();

      if (tours) {
        setSelectedTourId(tours.id);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleSuccess = () => {
    toast({
      title: "Réservation effectuée",
      description: "Votre réservation a été effectuée avec succès.",
    });
    navigate("/mes-reservations");
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!selectedTourId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm 
        tourId={selectedTourId}
        pickupCity="Paris"
        destinationCountry="TN"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}