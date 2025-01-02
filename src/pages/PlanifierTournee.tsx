import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import AuthDialog from "@/components/auth/AuthDialog";
import CreateTourForm from "@/components/tour/CreateTourForm";
import { TrendingUp, Users, Shield, Clock, Target, BarChart3, Bell, HeadphonesIcon } from "lucide-react";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlanifierTournee() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isCarrierAuthDialogOpen, setIsCarrierAuthDialogOpen] = useState(false);
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

  const benefits = [
    {
      title: "Rentabilité maximale",
      description: [
        "Chargez votre véhicule avant même de démarrer",
        "Remplissez vos trajets aller et retour pour maximiser vos revenus"
      ],
      icon: BarChart3
    },
    {
      title: "Planification simplifiée",
      description: [
        "Accédez à des demandes d'expédition à l'avance",
        "Réduisez le temps passé à attendre en France"
      ],
      icon: Clock
    },
    {
      title: "Flexibilité et contrôle",
      description: [
        "Créez des tournées adaptées à votre trajet",
        "Acceptez uniquement les demandes qui vous correspondent"
      ],
      icon: Target
    },
    {
      title: "Plus d'allers-retours",
      description: [
        "Optimisez votre planning pour multiplier les trajets",
        "Réduisez vos temps morts sur tout votre itinéraire"
      ],
      icon: TrendingUp
    }
  ];

  const steps = [
    {
      title: "Créez une tournée en quelques clics",
      description: "Indiquez votre trajet et vos disponibilités (lieux de collecte, date, heure)"
    },
    {
      title: "Recevez des demandes d'expédition",
      description: "Consultez les expéditeurs intéressés par votre tournée"
    },
    {
      title: "Optimisez votre véhicule",
      description: "Remplissez votre camion selon votre capacité"
    },
    {
      title: "Repartez chargé",
      description: "Planifiez votre retour avec des expéditions pour maximiser vos revenus"
    }
  ];

  const tools = [
    {
      title: "Tableau de bord personnalisé",
      description: "Suivez vos tournées, vos revenus, et vos expéditions",
      icon: BarChart3
    },
    {
      title: "Notifications instantanées",
      description: "Recevez les demandes en temps réel pour rester réactif",
      icon: Bell
    },
    {
      title: "Support dédié",
      description: "Une équipe à votre écoute pour vous accompagner",
      icon: HeadphonesIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showCreateForm && userType === 'carrier' ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">
              Créer une nouvelle tournée
            </h1>
            <CreateTourForm />
          </div>
        ) : (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-blue-600 md:text-5xl">
                Planifiez votre tournée et maximisez vos trajets !
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Gagnez du temps et optimisez vos revenus grâce à Colimero. En planifiant vos tournées à l'avance, 
                connectez-vous à un réseau d'expéditeurs prêts à expédier leurs colis, et réduisez vos kilomètres à vide.
              </p>
            </div>

            {/* Benefits Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">
                Pourquoi planifier une tournée avec Colimero ?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <ul className="space-y-2">
                      {benefit.description.map((item, idx) => (
                        <li key={idx} className="text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Comment ça marche ?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Section */}
            <div className="bg-blue-50 p-8 rounded-lg space-y-4">
              <h2 className="text-2xl font-bold">Exemple concret :</h2>
              <p className="text-gray-700">
                Vous êtes un transporteur qui part de Tunisie vers la France. Grâce à Colimero :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Vous pouvez collecter des colis sur votre trajet aller</li>
                <li>Une fois arrivé en France, vous recevez les demandes des expéditeurs pour le retour</li>
                <li>Vous passez moins de temps en attente et réalisez plus d'aller-retours</li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Optimisez votre trajet dès aujourd'hui</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Chez Colimero, nous savons que chaque minute compte. Planifiez à l'avance, minimisez vos trajets 
                à vide et connectez-vous à un large réseau d'expéditeurs fiables.
              </p>
              <Button
                onClick={handleCreateTourClick}
                size="lg"
                className={cn(
                  "bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg",
                  "transform transition hover:scale-105"
                )}
              >
                Créer une tournée
              </Button>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500">
                  Vous devez être connecté pour planifier une tournée
                </p>
              )}
            </div>

            {/* Tools Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Des outils pensés pour vous</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{tool.title}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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