import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

export function useRequestActions() {
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
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande",
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
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
      });
      return { success: false, error };
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande annulée",
        description: "La demande a été annulée avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la demande",
      });
      return { success: false, error };
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .delete()
        .eq('id', requestId)
        .eq('status', 'cancelled');

      if (error) throw error;

      toast({
        title: "Demande supprimée",
        description: "La demande a été supprimée avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la demande",
      });
      return { success: false, error };
    }
  };

  return {
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest
  };
}