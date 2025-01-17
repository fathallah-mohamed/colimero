import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequestList } from "./approval-requests/RequestList";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { ApprovalRequest } from "./approval-requests/types";
import { Loader2 } from "lucide-react";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["approval-requests"],
    queryFn: async () => {
      console.log("Fetching approval requests...");
      
      // First, fetch approval requests with tour data
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
          )
        `)
        .order("created_at", { ascending: false });

      if (approvalError) {
        console.error("Error fetching approval requests:", approvalError);
        throw approvalError;
      }

      // Then fetch client data for each request
      const requestsWithUserData = await Promise.all(
        approvalRequests.map(async (request) => {
          const { data: userData, error: userError } = await supabase
            .from("clients")
            .select("id, first_name, last_name, email, phone")
            .eq("id", request.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return {
              ...request,
              client: {
                id: request.user_id,
                first_name: "Unknown",
                last_name: "User",
                email: "",
                phone: ""
              }
            };
          }

          return {
            ...request,
            client: userData
          };
        })
      );
      
      console.log("Fetched approval requests:", requestsWithUserData);
      return requestsWithUserData as ApprovalRequest[];
    },
  });

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
      />

      <RequestDetailsDialog
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}