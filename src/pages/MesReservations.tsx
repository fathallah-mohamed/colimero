import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingList } from "@/components/booking/BookingList";
import { Loader2 } from "lucide-react";

export default function MesReservations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, redirecting to login");
        navigate('/connexion');
        return;
      }
      console.log("User session found:", session.user.id);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/connexion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

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