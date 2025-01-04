import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RejectedRequestCard } from "./rejected-requests/RejectedRequestCard";
import { RejectedRequestsTable } from "./rejected-requests/RejectedRequestsTable";
import { RejectedRequestDetails } from "./rejected-requests/RejectedRequestDetails";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RejectedRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["rejected-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", "rejected")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleReapprove = async (request: any) => {
    try {
      const { data: existingCarrier, error: checkError } = await supabase
        .from("carriers")
        .select("id")
        .eq("email", request.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingCarrier) {
        const { error: updateError } = await supabase
          .from("carriers")
          .update({ status: "active" })
          .eq("id", existingCarrier.id);

        if (updateError) throw updateError;
      }

      const { error: requestError } = await supabase
        .from("carrier_registration_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (requestError) throw requestError;

      await queryClient.invalidateQueries({ queryKey: ["rejected-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["approved-carriers"] });

      toast({
        title: "Transporteur réapprouvé",
        description: "Le compte du transporteur a été réactivé avec succès.",
      });
    } catch (error: any) {
      console.error("Error reapproving carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réapprouver le transporteur.",
      });
    }
  };

  const filteredRequests = requests?.filter(
    (request) =>
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests?.map((request) => (
            <RejectedRequestCard
              key={request.id}
              request={request}
              onViewDetails={setSelectedRequest}
              onReapprove={handleReapprove}
            />
          ))}
        </div>
      ) : (
        <RejectedRequestsTable
          requests={filteredRequests || []}
          onViewDetails={setSelectedRequest}
          onReapprove={handleReapprove}
        />
      )}

      <RejectedRequestDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}
