import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequestList } from "./approval-requests/RequestList";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { ApprovalRequest } from "./approval-requests/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["approval-requests"],
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

        console.log("Current user ID:", session.user.id);

        // Récupérer les tournées du transporteur
        const { data: tours, error: toursError } = await supabase
          .from("tours")
          .select("id")
          .eq("carrier_id", session.user.id);

        if (toursError) {
          console.error("Error fetching tours:", toursError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer vos tournées",
          });
          return [];
        }

        console.log("Carrier tours:", tours);

        if (!tours || tours.length === 0) {
          console.log("No tours found for carrier");
          return [];
        }

        // Récupérer les demandes d'approbation pour ces tournées
        const tourIds = tours.map(tour => tour.id);
        const { data: approvalRequests, error: approvalError } = await supabase
          .from("approval_requests")
          .select(`
            *,
            tour:tours(
              id,
              departure_country,
              destination_country,
              departure_date,
              collection_date,
              route,
              total_capacity,
              remaining_capacity,
              type,
              carriers(
                id,
                company_name,
                email,
                phone
              )
            ),
            client:clients(
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .in("tour_id", tourIds);

        if (approvalError) {
          console.error("Error fetching approval requests:", approvalError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les demandes d'approbation",
          });
          return [];
        }

        console.log("Fetched approval requests:", approvalRequests);
        return approvalRequests as ApprovalRequest[];
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

  const handleApprove = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from("approval_requests")
        .update({ 
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès.",
      });

      refetch();
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande.",
      });
    }
  };

  const handleReject = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from("approval_requests")
        .update({ 
          status: "rejected",
          updated_at: new Date().toISOString()
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès.",
      });

      refetch();
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <RequestList
        requests={requests}
        searchTerm={searchTerm}
        onSelect={setSelectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <RequestDetailsDialog
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}