import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { PlanningDialogs } from "@/components/tour/planning/PlanningDialogs";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import Navigation from "@/components/Navigation";

export default function EnvoyerColis() {
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

  const handleSendPackageClick = async () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (userType === 'carrier') {
      setIsAccessDeniedOpen(true);
      return;
    }

    if (userType === 'client') {
      navigate("/envoyer-colis");
    }
  };

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userType = session.user.user_metadata?.user_type;
      setUserType(userType);
      setIsAuthenticated(true);
      setIsAuthDialogOpen(false);

      if (userType === 'client') {
        navigate("/envoyer-colis");
      } else if (userType === 'carrier') {
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
        <SendPackageHero 
          isAuthenticated={isAuthenticated}
          onSendPackageClick={handleSendPackageClick}
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