import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { CarrierAuthDialog } from "@/components/auth/CarrierAuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";

export default function MesDemandesApprobation() {
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
      } else {
        setUserType(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center py-12">Mes Demandes d'Approbation</h1>
        {/* Your content for the approval requests goes here */}
      </div>

      <AuthDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
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
