import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CreateTourForm from "@/components/tour/CreateTourForm";
import Navigation from "@/components/Navigation";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

export default function CreateTour() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/connexion');
          return;
        }

        const currentUserType = session.user.user_metadata?.user_type;
        setUserType(currentUserType);
        setIsLoading(false);

        if (currentUserType !== 'carrier') {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Seuls les transporteurs peuvent créer des tournées",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (userType !== 'carrier') {
    return <AccessDeniedMessage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <CreateTourForm 
          onSuccess={() => {
            toast({
              title: "Succès",
              description: "La tournée a été créée avec succès",
            });
            navigate("/mes-tournees");
          }} 
        />
      </div>
    </div>
  );
}