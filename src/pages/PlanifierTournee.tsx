import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { TrendingUp, Users, Shield } from "lucide-react";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";

export default function PlanifierTournee() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'client' | 'carrier' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsAuthenticated(false);
          setUserType(null);
          return;
        }

        setIsAuthenticated(!!session);
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          setUserType(userMetadata.user_type as 'client' | 'carrier');
          
          // Show access denied dialog if user is a client
          if (userMetadata.user_type === 'client') {
            setIsAccessDeniedOpen(true);
          }
        } else {
          setUserType(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier');
        
        // Show access denied dialog if user is a client
        if (userMetadata.user_type === 'client') {
          setIsAccessDeniedOpen(true);
        }
      } else {
        setUserType(null);
      }

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserType(null);
        navigate('/connexion');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          userType === 'carrier' ? (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-center">
                Créer une nouvelle tournée
              </h1>
              <CreateTourForm />
            </div>
          ) : (
            <AccessDeniedMessage 
              userType="client" 
              isOpen={isAccessDeniedOpen}
              onClose={() => {
                setIsAccessDeniedOpen(false);
                navigate('/');
              }}
            />
          )
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0091FF] mb-6">
              Créez votre tournée en quelques clics
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Optimisez vos livraisons et maximisez vos revenus
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <TrendingUp className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Augmentez vos revenus
                </h3>
                <p className="text-gray-600">
                  Optimisez vos trajets et maximisez votre rentabilité
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <Users className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Élargissez votre clientèle
                </h3>
                <p className="text-gray-600">
                  Accédez à une nouvelle base de clients
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <Shield className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  En toute sécurité
                </h3>
                <p className="text-gray-600">
                  Profitez d'une plateforme sécurisée et fiable
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthDialogOpen(true)}
              className="bg-[#0091FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#007ACC] transition-colors"
            >
              Commencer maintenant
            </button>
          </div>
        )}
      </div>

      <CarrierAuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </div>
  );
}