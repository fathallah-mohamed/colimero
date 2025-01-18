import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { BookingList } from "@/components/booking/BookingList";
import { useToast } from "@/hooks/use-toast";

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
      console.log("User type:", userType);
      console.log("User session:", session);
      
      if (userType !== 'client') {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux clients.",
        });
        navigate('/');
        return;
      }

      // Vérifier si l'utilisateur a des réservations
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id);

      console.log("Initial bookings check:", { bookings, error });
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