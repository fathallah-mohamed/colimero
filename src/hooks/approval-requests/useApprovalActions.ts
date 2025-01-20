import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequest } from "./types";

export function useApprovalActions() {
  const { toast } = useToast();

  const handleApproveRequest = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été approuvée",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
      return { success: false, error };
    }
  };

  const handleRejectRequest = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été rejetée",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
      return { success: false, error };
    }
  };

  return {
    handleApproveRequest,
    handleRejectRequest,
  };
}