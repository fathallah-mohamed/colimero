import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookingForm from "@/components/booking/BookingForm";

export default function SendPackage() {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    };

    checkSession();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Envoyer un colis
        </h1>
        <BookingForm />
      </div>
    </div>
  );
}