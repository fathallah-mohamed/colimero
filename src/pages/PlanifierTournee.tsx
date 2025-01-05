import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { PlanningContent } from "@/components/tour/planning/PlanningContent";
import { PlanningDialogs } from "@/components/tour/planning/PlanningDialogs";

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
          <PlanningContent 
            isAuthenticated={isAuthenticated}
            onCreateTourClick={handleCreateTourClick}
            onAuthClick={() => setIsAuthDialogOpen(true)}
          />
        )}
      </div>

      <PlanningDialogs 
        isAuthDialogOpen={isAuthDialogOpen}
        isAccessDeniedOpen={isAccessDeniedOpen}
        showCarrierSignupForm={showCarrierSignupForm}
        onAuthClose={() => setIsAuthDialogOpen(false)}
        onAccessDeniedClose={() => setIsAccessDeniedOpen(false)}
        onCarrierSignupClose={setShowCarrierSignupForm}
        onAuthSuccess={handleAuthSuccess}
        onCarrierRegisterClick={() => {
          setIsAuthDialogOpen(false);
          setShowCarrierSignupForm(true);
        }}
      />
    </div>
  );
}