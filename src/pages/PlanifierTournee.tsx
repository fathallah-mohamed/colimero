import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { PlanningContent } from "@/components/tour/planning/PlanningContent";
import { PlanningDialogs } from "@/components/tour/planning/PlanningDialogs";

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setShowAuthDialog(true);
          setIsLoading(false);
          return;
        }

        const userType = session.user?.user_metadata?.user_type;

        if (userType === "admin") {
          toast({
            title: "Accès refusé",
            description: "Les administrateurs ne peuvent pas créer de tournées.",
          });
          navigate('/');
          return;
        }

        if (userType !== "carrier") {
          setShowAccessDeniedDialog(true);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  if (isLoading) {
    return <TransporteurLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanningContent />
      <PlanningDialogs 
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        showAccessDeniedDialog={showAccessDeniedDialog}
        setShowAccessDeniedDialog={setShowAccessDeniedDialog}
      />
    </div>
  );
}