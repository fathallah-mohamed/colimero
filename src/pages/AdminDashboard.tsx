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

    if (session.user.email !== "admin@colimero.fr") {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page.",
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