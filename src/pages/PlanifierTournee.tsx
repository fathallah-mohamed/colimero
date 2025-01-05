import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { CarrierAuthDialog } from "@/components/auth/CarrierAuthDialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { PlanningHero } from "@/components/tour/planning/PlanningHero";
import { PlanningAdvantages } from "@/components/tour/planning/PlanningAdvantages";
import { PlanningSteps } from "@/components/tour/planning/PlanningSteps";
import { PlanningExample } from "@/components/tour/planning/PlanningExample";
import { PlanningBenefits } from "@/components/tour/planning/PlanningBenefits";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isCarrierAuthDialogOpen, setIsCarrierAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'client' | 'carrier' | 'admin' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier' | 'admin');
        
        // Redirect admins to home page
        if (userMetadata.user_type === 'admin') {
          navigate('/');
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Les administrateurs ne peuvent pas créer de tournées.",
          });
        }
      } else {
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier' | 'admin');
        
        // Redirect admins to home page
        if (userMetadata.user_type === 'admin') {
          navigate('/');
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Les administrateurs ne peuvent pas créer de tournées.",
          });
        }
      } else {
        setUserType(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleCreateTourClick = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (userType === 'client') {
      setIsAccessDeniedOpen(true);
      return;
    }

    if (userType === 'carrier') {
      setShowCreateForm(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    if (userType === 'carrier') {
      setShowCreateForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showCreateForm && userType === 'carrier' ? (
          <div className="space-y-8 py-12">
            <h1 className="text-3xl font-bold text-center">
              Créer une nouvelle tournée
            </h1>
            <CreateTourForm />
          </div>
        ) : (
          <>
            <PlanningHero onCreateTourClick={handleCreateTourClick} />
            <PlanningAdvantages />
            <PlanningSteps />
            <PlanningExample />
            <PlanningBenefits />
            
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-8">
                Prêt à commencer ? Cliquez sur le bouton ci-dessous :
              </p>
              <Button
                onClick={handleCreateTourClick}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transform transition hover:scale-105"
              >
                Créer une tournée
              </Button>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-4">
                  Vous devez être connecté pour planifier une tournée
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="carrier"
        onRegisterClick={() => {
          setIsAuthDialogOpen(false);
          setIsCarrierAuthDialogOpen(true);
        }}
      />

      <CarrierAuthDialog
        isOpen={isCarrierAuthDialogOpen}
        onClose={() => setIsCarrierAuthDialogOpen(false)}
      />

      <AccessDeniedMessage 
        userType="client" 
        isOpen={isAccessDeniedOpen}
        onClose={() => setIsAccessDeniedOpen(false)}
      />
    </div>
  );
}
