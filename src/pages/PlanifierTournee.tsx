import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { TrendingUp, Users, Shield } from "lucide-react";

export default function PlanifierTournee() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenus optimisés",
      description:
        "Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.",
    },
    {
      icon: Users,
      title: "Réseau d'expéditeurs",
      description:
        "Accédez à une large base de clients vérifiés prêts à expédier.",
    },
    {
      icon: Shield,
      title: "Gestion simplifiée",
      description:
        "Gérez facilement vos tournées et vos clients via notre plateforme intuitive.",
    },
  ];

  const handleCreateTourClick = () => {
    setIsAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">
              Créer une nouvelle tournée
            </h1>
            <CreateTourForm />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0091FF] mb-6">
              Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
            </h1>
            <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
              Créez facilement une tournée pour vos trajets, remplissez votre
              véhicule et optimisez vos revenus. Grâce à Colimero, vous accédez à
              un large réseau d'expéditeurs prêts à collaborer.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-[#0091FF]/10 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-[#0091FF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-[#0091FF] hover:bg-[#0091FF]/90 text-white px-8"
              onClick={handleCreateTourClick}
            >
              Créer une tournée
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Vous devez être connecté pour planifier une tournée
            </p>
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