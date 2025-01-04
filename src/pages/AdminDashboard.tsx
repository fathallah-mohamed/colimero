import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewRegistrationRequests from "@/components/admin/NewRegistrationRequests";
import ApprovedCarriers from "@/components/admin/ApprovedCarriers";
import RejectedRequests from "@/components/admin/RejectedRequests";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Tableau de bord administrateur
      </h1>
      
      <Tabs defaultValue="new" className="w-full space-y-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3'}`}>
          <TabsTrigger 
            value="new"
            className="px-4 py-2 text-sm md:text-base whitespace-nowrap"
          >
            Nouvelles demandes
          </TabsTrigger>
          <TabsTrigger 
            value="approved"
            className="px-4 py-2 text-sm md:text-base whitespace-nowrap"
          >
            Transporteurs validés
          </TabsTrigger>
          <TabsTrigger 
            value="rejected"
            className="px-4 py-2 text-sm md:text-base whitespace-nowrap"
          >
            Transporteurs rejetés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          <NewRegistrationRequests />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <ApprovedCarriers />
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          <RejectedRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}