import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { ClientApprovalRequests } from "@/components/approval-requests/ClientApprovalRequests";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page.",
        });
        navigate("/connexion");
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      if (userType !== 'client') {
        toast({
          variant: "destructive",
          title: "Accès refusé", 
          description: "Cette page est réservée aux clients.",
        });
        navigate("/");
        return;
      }

      setUserType(userType);
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Mes demandes d'approbation
          </h1>
        </div>

        <ClientApprovalRequests />
      </div>
    </div>
  );
}