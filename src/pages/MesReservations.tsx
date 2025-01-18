import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { BookingList } from "@/components/booking/BookingList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function MesReservations() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        sessionStorage.setItem('returnPath', '/mes-reservations');
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à vos réservations.",
        });
        navigate('/connexion');
        return;
      }

      // Vérifier si l'utilisateur est un client
      const userType = session.user?.user_metadata?.user_type;
      if (userType !== 'client') {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux clients.",
        });
        navigate('/');
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>
        <BookingList />
      </div>
    </div>
  );
}