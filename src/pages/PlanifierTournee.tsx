import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { PlanningContent } from "@/components/tour/planning/PlanningContent";
import { PlanningDialogs } from "@/components/tour/planning/PlanningDialogs";
import Navigation from "@/components/Navigation";

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleCreateTourClick = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    // Rediriger vers la page de création de tournée
    navigate("/transporteur/tournees/creer");
  };

  const handleAuthClick = () => {
    setIsAuthDialogOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    setIsAuthenticated(true);
  };

  const handleCarrierRegisterClick = () => {
    setIsAuthDialogOpen(false);
    setShowCarrierSignupForm(true);
  };

  if (isLoading) {
    return <TransporteurLoading />;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <PlanningContent 
          isAuthenticated={isAuthenticated}
          onCreateTourClick={handleCreateTourClick}
          onAuthClick={handleAuthClick}
        />
        <PlanningDialogs 
          isAuthDialogOpen={isAuthDialogOpen}
          isAccessDeniedOpen={isAccessDeniedOpen}
          showCarrierSignupForm={showCarrierSignupForm}
          onAuthClose={() => setIsAuthDialogOpen(false)}
          onAccessDeniedClose={() => setIsAccessDeniedOpen(false)}
          onCarrierSignupClose={() => setShowCarrierSignupForm(false)}
          onAuthSuccess={handleAuthSuccess}
          onCarrierRegisterClick={handleCarrierRegisterClick}
        />
      </div>
    </>
  );
}