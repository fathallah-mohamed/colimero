import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequestList } from "./approval-requests/RequestList";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { CarrierRegistrationRequest, ApprovalRequest, Tour, Client } from "./approval-requests/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CarrierRegistrationRequest | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["carrier-registration-requests"],
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

        const { data: registrationRequests, error: requestsError } = await supabase
          .from("carrier_registration_requests")
          .select("*")
          .eq("status", "pending");

        if (requestsError) {
          console.error("Error fetching registration requests:", requestsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les demandes d'inscription",
          });
          return [];
        }

        console.log("Fetched registration requests:", registrationRequests);
        
        // Transform CarrierRegistrationRequest to ApprovalRequest
        const transformedRequests = (registrationRequests as CarrierRegistrationRequest[]).map(request => ({
          id: request.id,
          user_id: request.id,
          tour_id: 0,
          status: request.status,
          message: request.reason,
          created_at: request.created_at,
          updated_at: request.updated_at,
          reason: request.reason,
          email_sent: false,
          activation_token: null,
          activation_expires_at: null,
          pickup_city: "",
          tour: {} as Tour,
          client: {} as Client,
          company_name: request.company_name,
          email: request.email,
          first_name: request.first_name,
          last_name: request.last_name,
          phone: request.phone
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

  const handleApprove = async (request: CarrierRegistrationRequest) => {
    try {
      const { error } = await supabase
        .from("carrier_registration_requests")
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

  const handleReject = async (request: CarrierRegistrationRequest) => {
    try {
      const { error } = await supabase
        .from("carrier_registration_requests")
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
        onSelect={(request: ApprovalRequest) => {
          const originalRequest = requests.find(r => r.id === request.id);
          setSelectedRequest(originalRequest as unknown as CarrierRegistrationRequest);
        }}
        onApprove={async (request: ApprovalRequest) => {
          const originalRequest = requests.find(r => r.id === request.id);
          await handleApprove(originalRequest as unknown as CarrierRegistrationRequest);
        }}
        onReject={async (request: ApprovalRequest) => {
          const originalRequest = requests.find(r => r.id === request.id);
          await handleReject(originalRequest as unknown as CarrierRegistrationRequest);
        }}
      />

      <RequestDetailsDialog
        request={selectedRequest ? {
          ...selectedRequest,
          user_id: selectedRequest.id,
          tour_id: 0,
          message: selectedRequest.reason,
          email_sent: false,
          activation_token: null,
          activation_expires_at: null,
          pickup_city: "",
          tour: {} as Tour,
          client: {} as Client,
        } as ApprovalRequest : null}
        onClose={() => setSelectedRequest(null)}
        onApprove={async (request: ApprovalRequest) => {
          await handleApprove(selectedRequest as CarrierRegistrationRequest);
        }}
        onReject={async (request: ApprovalRequest) => {
          await handleReject(selectedRequest as CarrierRegistrationRequest);
        }}
      />
    </div>
  );
}