import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { PlanningHero } from "@/components/tour/planning/PlanningHero";
import { PlanningAdvantages } from "@/components/tour/planning/PlanningAdvantages";
import { PlanningSteps } from "@/components/tour/planning/PlanningSteps";
import { PlanningExample } from "@/components/tour/planning/PlanningExample";
import { PlanningBenefits } from "@/components/tour/planning/PlanningBenefits";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierSignupForm } from "@/components/auth/CarrierSignupForm";

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'client' | 'carrier' | 'admin' | null>(null);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsAuthenticated(false);
          setUserType(null);
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          setUserType(null);
          return;
        }

        setIsAuthenticated(true);
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier' | 'admin');
        
        if (userMetadata.user_type === 'admin') {
          navigate('/');
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Les administrateurs ne peuvent pas créer de tournées.",
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          setUserType(userMetadata.user_type as 'client' | 'carrier' | 'admin');
          
          if (userMetadata.user_type === 'admin') {
            navigate('/');
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Les administrateurs ne peuvent pas créer de tournées.",
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserType(null);
        setShowCreateForm(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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
            <CreateTourForm onSuccess={() => {
              toast({
                title: "Tournée créée",
                description: "Votre tournée a été créée avec succès.",
              });
              navigate('/mes-tournees');
            }} />
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
              <div className="space-y-4">
                <Button
                  onClick={handleCreateTourClick}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transform transition hover:scale-105"
                >
                  Créer une tournée
                </Button>
                {!isAuthenticated && (
                  <Button
                    onClick={() => setIsAuthDialogOpen(true)}
                    variant="outline"
                    size="lg"
                    className="w-full max-w-md"
                  >
                    Devenir transporteur
                  </Button>
                )}
              </div>
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
        }}
        onCarrierRegisterClick={() => {
          setIsAuthDialogOpen(false);
          setShowCarrierSignupForm(true);
        }}
      />

      <AccessDeniedMessage 
        userType="client" 
        isOpen={isAccessDeniedOpen}
        onClose={() => setIsAccessDeniedOpen(false)}
      />

      <Dialog open={showCarrierSignupForm} onOpenChange={setShowCarrierSignupForm}>
        <DialogContent className="max-w-4xl">
          <CarrierSignupForm onSuccess={() => {
            setShowCarrierSignupForm(false);
            toast({
              title: "Inscription réussie",
              description: "Votre demande d'inscription a été envoyée avec succès.",
            });
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}