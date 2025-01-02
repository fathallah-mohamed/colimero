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
      .single();

    if (adminError || !adminData) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page.",
      });
      navigate("/");
      return;
    }

    // Si l'email est admin@colimero.fr, supprimer le compte
    if (session.user.email === 'admin@colimero.fr') {
      try {
        // Supprimer d'abord les données de la table administrators
        await supabase
          .from('administrators')
          .delete()
          .eq('id', session.user.id);

        // Supprimer le compte auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          session.user.id
        );

        if (deleteError) throw deleteError;

        // Déconnecter l'utilisateur
        await supabase.auth.signOut();
        
        toast({
          title: "Compte supprimé",
          description: "Le compte admin a été supprimé avec succès.",
        });
        
        navigate("/connexion");
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du compte.",
        });
      }
      return;
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