import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequestList } from "./approval-requests/RequestList";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { Carrier } from "@/types/carrier";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Carrier | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["carrier-requests", "pending"],
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

        const { data: pendingCarriers, error: carriersError } = await supabase
          .from("carriers")
          .select("*")
          .eq("status", "pending");

        if (carriersError) {
          console.error("Error fetching carriers:", carriersError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les demandes d'inscription",
          });
          return [];
        }

        return pendingCarriers as Carrier[];
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

  const handleApprove = async (carrier: Carrier) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase.rpc('approve_carrier', {
        carrier_id: carrier.id,
        admin_id: session.user.id
      });

      if (error) throw error;

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
        description: "Une erreur est survenue lors de l'approbation de la demande.",
      });
    }
  };

  const handleReject = async (carrier: Carrier, reason: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase.rpc('reject_carrier', {
        carrier_id: carrier.id,
        admin_id: session.user.id,
        rejection_reason: reason
      });

      if (error) throw error;

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