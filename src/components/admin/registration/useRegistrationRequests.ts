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

        const { data: pendingCarriers, error: requestsError } = await supabase
          .from("carriers")
          .select(`
            id,
            company_name,
            email,
            phone,
            phone_secondary,
            first_name,
            last_name,
            siret,
            address,
            coverage_area,
            avatar_url,
            company_details,
            authorized_routes,
            created_at,
            status,
            email_verified,
            total_deliveries,
            cities_covered
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

        // Transform the data to match ApprovalRequest type
        const transformedRequests: ApprovalRequest[] = pendingCarriers.map(carrier => ({
          id: carrier.id,
          user_id: carrier.id,
          tour_id: 0,
          status: carrier.status as "pending" | "active" | "rejected",
          message: null,
          created_at: carrier.created_at,
          updated_at: carrier.created_at, // Use created_at since updated_at doesn't exist
          reason: null,
          email_sent: false,
          activation_token: null,
          activation_expires_at: null,
          pickup_city: "",
          tour: {
            id: 0,
            carrier_id: carrier.id,
            route: [],
            total_capacity: 0,
            remaining_capacity: 0,
            departure_date: new Date().toISOString(),
            collection_date: new Date().toISOString(),
            created_at: carrier.created_at,
            updated_at: carrier.created_at,
            departure_country: "FR",
            destination_country: "TN",
            status: "pending",
            type: "public",
            previous_status: null,
            terms_accepted: false,
            customs_declaration: false,
            tour_number: null,
            carrier: {
              id: carrier.id,
              company_name: carrier.company_name,
              email: carrier.email,
              phone: carrier.phone
            }
          },
          client: {
            id: carrier.id,
            first_name: carrier.first_name,
            last_name: carrier.last_name,
            email: carrier.email,
            phone: carrier.phone
          },
          carrier: {
            id: carrier.id,
            company_name: carrier.company_name,
            email: carrier.email,
            phone: carrier.phone,
            phone_secondary: carrier.phone_secondary || "",
            first_name: carrier.first_name,
            last_name: carrier.last_name,
            siret: carrier.siret,
            address: carrier.address,
            coverage_area: carrier.coverage_area,
            avatar_url: carrier.avatar_url,
            company_details: carrier.company_details,
            authorized_routes: carrier.authorized_routes,
            email_verified: carrier.email_verified || false,
            total_deliveries: carrier.total_deliveries || 0,
            cities_covered: carrier.cities_covered || 30,
            status: carrier.status as "pending" | "active" | "rejected",
            created_at: carrier.created_at,
            updated_at: carrier.created_at // Use created_at since updated_at doesn't exist
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