import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { approveCarrierRequest, rejectCarrierRequest } from "@/services/carrier-approval";
import { ApprovalRequest } from "../approval-requests/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export function useRegistrationActions(
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<ApprovalRequest[], Error>>
) {
  const { toast } = useToast();

  const handleApprove = async (request: ApprovalRequest) => {
    try {
      console.log("Starting approval process for carrier:", request.carrier?.id);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No session found");
        throw new Error("No session");
      }

      if (!request.carrier?.id) {
        console.error("No carrier ID found in request");
        throw new Error("Invalid carrier data");
      }

      await approveCarrierRequest(request.carrier.id, session.user.id);
      
      toast({
        title: "Demande approuvée",
        description: "Le transporteur a été approuvé avec succès.",
      });
      
      await refetch();
    } catch (error: any) {
      console.error("Error approving carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation.",
      });
    }
  };

  const handleReject = async (request: ApprovalRequest) => {
    try {
      console.log("Starting rejection process for carrier:", request.carrier?.id);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No session found");
        throw new Error("No session");
      }

      if (!request.carrier?.id) {
        console.error("No carrier ID found in request");
        throw new Error("Invalid carrier data");
      }

      await rejectCarrierRequest(request.carrier.id, session.user.id, request.reason || '');

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès.",
      });

      await refetch();
    } catch (error: any) {
      console.error("Error rejecting carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet.",
      });
    }
  };

  return {
    handleApprove,
    handleReject
  };
}