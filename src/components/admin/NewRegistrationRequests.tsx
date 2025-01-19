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
      const { data, error } = await supabase
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
          client:auth.users!inner(
            id,
            email,
            raw_user_meta_data->first_name,
            raw_user_meta_data->last_name,
            raw_user_meta_data->phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching approval requests:", error);
        throw error;
      }
      
      // Transform the data to match our interface
      const transformedData = data.map(request => ({
        ...request,
        client: {
          id: request.client?.id,
          first_name: request.client?.first_name,
          last_name: request.client?.last_name,
          email: request.client?.email,
          phone: request.client?.phone
        }
      })) as ApprovalRequest[];
      
      console.log("Fetched approval requests:", transformedData);
      return transformedData;
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