import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewRequestCard } from "./new-requests/NewRequestCard";
import { NewRequestsTable } from "./new-requests/NewRequestsTable";
import Navigation from "@/components/Navigation";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { approveCarrierRequest } from "@/services/carrier-approval";
import { ApprovalRequest } from "./approval-requests/types";

export default function RejectedRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["approval-requests", "rejected"],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq("status", "rejected")
        .order("created_at", { ascending: false })
        .returns<ApprovalRequest[]>();

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (request: ApprovalRequest) => {
    if (isApproving) return;
    
    setIsApproving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      await approveCarrierRequest(request.carrier?.id || '', session.user.id);

      toast({
        title: "Demande approuvée",
        description: "Le transporteur a été approuvé avec succès.",
      });

      refetch();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation de la demande.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (request: ApprovalRequest, reason: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'rejected',
          reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès",
      });

      refetch();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
      });
    }
  };

  const filteredRequests = requests?.filter(
    (request) =>
      request.carrier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.carrier?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="hidden md:block">
          <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
            <NewRequestsTable
              requests={filteredRequests}
              onViewDetails={setSelectedRequest}
              showApproveButton={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredRequests?.map((request) => (
            <NewRequestCard
              key={request.id}
              request={request}
              onViewDetails={() => setSelectedRequest(request)}
              showApproveButton={true}
              onApprove={() => handleApprove(request)}
            />
          ))}
        </div>

        <RequestDetailsDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          showApproveButton={true}
        />
      </div>
    </div>
  );
}