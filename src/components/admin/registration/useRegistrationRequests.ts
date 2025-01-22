import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ApprovalRequest } from "../approval-requests/types";

export function useRegistrationRequests() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["carriers", "pending"],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Veuillez vous reconnecter",
          });
          navigate("/connexion");
          return [];
        }

        if (!session) {
          console.log("No session found");
          navigate("/connexion");
          return [];
        }

        // Modifié pour sélectionner directement depuis la table carriers
        const { data: pendingCarriers, error: requestsError } = await supabase
          .from("carriers")
          .select(`
            id,
            company_name,
            email,
            phone,
            first_name,
            last_name,
            siret,
            address,
            coverage_area,
            avatar_url,
            company_details,
            authorized_routes,
            created_at,
            status
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (requestsError) {
          console.error("Error fetching requests:", requestsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les demandes d'inscription",
          });
          return [];
        }

        // Transformer les données pour correspondre au format ApprovalRequest
        const transformedRequests: ApprovalRequest[] = pendingCarriers.map(carrier => ({
          id: carrier.id,
          status: carrier.status,
          created_at: carrier.created_at,
          carrier: {
            id: carrier.id,
            company_name: carrier.company_name,
            email: carrier.email,
            phone: carrier.phone,
            first_name: carrier.first_name,
            last_name: carrier.last_name,
            siret: carrier.siret,
            address: carrier.address,
            coverage_area: carrier.coverage_area,
            avatar_url: carrier.avatar_url,
            company_details: carrier.company_details,
            authorized_routes: carrier.authorized_routes
          }
        }));

        return transformedRequests;
      } catch (error: any) {
        console.error("Complete error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des données",
        });
        return [];
      }
    },
  });

  return {
    requests,
    isLoading,
    refetch
  };
}