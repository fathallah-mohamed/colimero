import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";

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
    <div className="container mx-auto px-4 py-8">
      <BookingForm />
    </div>
  );
}