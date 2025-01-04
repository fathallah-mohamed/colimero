import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlanningHero } from "@/components/tour/planning/PlanningHero";
import { PlanningSteps } from "@/components/tour/planning/PlanningSteps";
import { PlanningBenefits } from "@/components/tour/planning/PlanningBenefits";
import { PlanningAdvantages } from "@/components/tour/planning/PlanningAdvantages";
import { PlanningExample } from "@/components/tour/planning/PlanningExample";
import { supabase } from "@/integrations/supabase/client";

export default function PlanDelivery() {
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
      if (userType !== "carrier") {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux transporteurs.",
        });
        navigate("/");
      }
    };

    checkSession();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanningHero onCreateTourClick={() => navigate("/planifier-tournee")} />
      <PlanningSteps />
      <PlanningBenefits />
      <PlanningAdvantages />
      <PlanningExample />
    </div>
  );
}