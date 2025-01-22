import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { approveCarrierRequest, rejectCarrierRequest } from "@/services/carrier-approval";
import { RequestList } from "./carrier-requests/RequestList";
import { ApprovalRequest } from "./approval-requests/types";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
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

        return pendingRequests;
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      await approveCarrierRequest(request.carrier.id, session.user.id);
      
      toast({
        title: "Demande approuvée",
        description: "Le transporteur a été approuvé avec succès.",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error approving carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation.",
      });
    }
  };

  const handleReject = async (request: ApprovalRequest, reason: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      await rejectCarrierRequest(request.carrier.id, session.user.id, reason);

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès.",
      });

      refetch();
    } catch (error: any) {
      console.error("Error rejecting carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet.",
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