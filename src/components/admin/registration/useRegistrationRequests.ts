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

        const { data: pendingRequests, error: requestsError } = await supabase
          .from("approval_requests")
          .select(`
            *,
            carrier:carriers (
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
              authorized_routes
            )
          `)
          .eq("status", "pending")
          .returns<ApprovalRequest[]>();

        if (requestsError) {
          console.error("Error fetching requests:", requestsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les demandes d'inscription",
          });
          return [];
        }

        return pendingRequests || [];
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