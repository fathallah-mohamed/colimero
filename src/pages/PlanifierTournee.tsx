import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { TrendingUp, Users, Shield } from "lucide-react";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { Button } from "@/components/ui/button";

export default function PlanifierTournee() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'client' | 'carrier' | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier');
      } else {
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata.user_type as 'client' | 'carrier');
      } else {
        setUserType(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCreateTourClick = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (userType === 'client') {
      setIsAccessDeniedOpen(true);
      return;
    }
  };

  const renderContent = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-[#0091FF] mb-6">
          Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Créez facilement une tournée pour vos trajets, remplissez votre véhicule et optimisez vos revenus. 
          Grâce à Colimero, vous accédez à un large réseau d'expéditeurs prêts à collaborer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TrendingUp className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Revenus optimisés
            </h3>
            <p className="text-gray-600">
              Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <Users className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Réseau d'expéditeurs
            </h3>
            <p className="text-gray-600">
              Accédez à une large base de clients vérifiés prêts à expédier.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-[#0091FF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Gestion simplifiée
            </h3>
            <p className="text-gray-600">
              Gérez facilement vos tournées et vos clients via notre plateforme intuitive.
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreateTourClick}
          className="bg-[#0091FF] text-white px-8 py-6 rounded-lg font-semibold hover:bg-[#007ACC] transition-colors text-lg"
        >
          Créer une tournée
        </Button>

        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-4">
            Vous devez être connecté pour planifier une tournée
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated && userType === 'carrier' ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">
              Créer une nouvelle tournée
            </h1>
            <CreateTourForm />
          </div>
        ) : (
          renderContent()
        )}
      </div>

      <CarrierAuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />

      <AccessDeniedMessage 
        userType="client" 
        isOpen={isAccessDeniedOpen}
        onClose={() => setIsAccessDeniedOpen(false)}
      />
    </div>
  );
}