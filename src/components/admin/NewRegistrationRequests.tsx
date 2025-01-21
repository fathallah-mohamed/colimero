import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequestList } from "./approval-requests/RequestList";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { ApprovalRequest } from "./approval-requests/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const { toast } = useToast();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["approval-requests"],
    queryFn: async () => {
      console.log("Fetching approval requests...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      console.log("Current user ID:", session.user.id);

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
        .eq("tour.carriers.id", session.user.id);

      if (approvalError) {
        console.error("Error fetching approval requests:", approvalError);
        throw approvalError;
      }

      console.log("Fetched approval requests:", approvalRequests);
      return approvalRequests as ApprovalRequest[];
    },
  });

  const handleApprove = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from("approval_requests")
        .update({ status: "approved" })
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
        .update({ status: "rejected" })
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

  console.log("Rendering requests:", requests);

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