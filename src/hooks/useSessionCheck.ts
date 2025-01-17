import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSessionCheck() {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          variant: "destructive",
          title: "Erreur de session",
          description: "Une erreur est survenue avec votre session. Veuillez vous reconnecter.",
        });
        navigate('/connexion');
        return;
      }

      if (!session) {
        console.log("No session found");
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour voir vos réservations.",
        });
        navigate('/connexion');
        return;
      }

      console.log("Session found:", session.user.id);
    };

    checkAuth();
  }, [navigate, toast]);
}