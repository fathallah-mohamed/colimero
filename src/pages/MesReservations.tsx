import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { BookingList } from "@/components/booking/BookingList";
import { useToast } from "@/hooks/use-toast";

export default function MesReservations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('returnPath', '/mes-reservations');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à vos réservations.",
      });
      navigate('/connexion');
    }
  }, [user, navigate, toast]);

  if (!user) return null;

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