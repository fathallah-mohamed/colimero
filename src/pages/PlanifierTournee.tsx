import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { PlanningContent } from "@/components/tour/planning/PlanningContent";
import { PlanningDialogs } from "@/components/tour/planning/PlanningDialogs";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import Navigation from "@/components/Navigation";

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session) {
          const currentUserType = session.user.user_metadata?.user_type;
          setUserType(currentUserType);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleCreateTourClick = async () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (userType === 'client') {
      setIsAccessDeniedOpen(true);
      return;
    }

    if (userType === 'carrier') {
      navigate("/transporteur/tournees/creer");
    }
  };

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userType = session.user.user_metadata?.user_type;
      setUserType(userType);
      setIsAuthenticated(true);
      setIsAuthDialogOpen(false);

      if (userType === 'carrier') {
        navigate("/transporteur/tournees/creer");
      } else if (userType === 'client') {
        setIsAccessDeniedOpen(true);
      }
    }
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
          onAuthClick={() => setIsAuthDialogOpen(true)}
        />
        <PlanningDialogs 
          isAuthDialogOpen={isAuthDialogOpen}
          isAccessDeniedOpen={isAccessDeniedOpen}
          showCarrierSignupForm={showCarrierSignupForm}
          onAuthClose={() => setIsAuthDialogOpen(false)}
          onAccessDeniedClose={() => setIsAccessDeniedOpen(false)}
          onCarrierSignupClose={setShowCarrierSignupForm}
          onAuthSuccess={handleAuthSuccess}
          onCarrierRegisterClick={handleCarrierRegisterClick}
        />
      </div>
    </>
  );
}