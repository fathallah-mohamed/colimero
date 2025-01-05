import Navigation from "@/components/Navigation";
import { ClientsList } from "@/components/admin/clients/ClientsList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminClients() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, redirecting to login");
        navigate("/connexion");
        return;
      }

      console.log("Checking admin access for user:", session.user.id);
      
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (adminError) {
        console.error('Erreur de vérification admin:', adminError);
        throw adminError;
      }

      if (!adminData) {
        console.log('No admin data found for user:', session.user.id);
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à cette page.",
        });
        navigate("/");
        return;
      }

      console.log('Admin data found:', adminData);
    } catch (error) {
      console.error('Erreur de vérification admin:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de vos droits d'accès.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <ClientsList />
      </div>
    </div>
  );
}