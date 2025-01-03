import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewRegistrationRequests from "@/components/admin/NewRegistrationRequests";
import ApprovedCarriers from "@/components/admin/ApprovedCarriers";
import RejectedRequests from "@/components/admin/RejectedRequests";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/connexion");
        return;
      }

      // Vérifier si l'utilisateur est un administrateur
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
        console.error('Accès refusé: utilisateur non administrateur');
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à cette page.",
        });
        navigate("/");
        return;
      }

      console.log('Données admin trouvées:', adminData);
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">Nouvelles demandes</TabsTrigger>
          <TabsTrigger value="approved">Transporteurs validés</TabsTrigger>
          <TabsTrigger value="rejected">Transporteurs rejetés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <NewRegistrationRequests />
        </TabsContent>
        
        <TabsContent value="approved">
          <ApprovedCarriers />
        </TabsContent>
        
        <TabsContent value="rejected">
          <RejectedRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}