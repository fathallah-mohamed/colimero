import { useModalDialog } from "@/hooks/use-modal-dialog";
import { supabase } from "@/integrations/supabase/client";

export function useRequestManagement() {
  const { showDialog } = useModalDialog();

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

      showDialog({
        title: "Succès",
        description: "La demande a été annulée avec succès",
        variant: "default"
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      showDialog({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la demande",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const { error: checkError, data: request } = await supabase
        .from('approval_requests')
        .select('status')
        .eq('id', requestId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (request?.status !== 'cancelled') {
        showDialog({
          title: "Erreur",
          description: "Seules les demandes annulées peuvent être supprimées",
          variant: "destructive"
        });
        return { success: false };
      }

      const { error } = await supabase
        .from('approval_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      showDialog({
        title: "Succès",
        description: "La demande a été supprimée avec succès",
        variant: "default"
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting request:', error);
      showDialog({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la demande",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    handleCancelRequest,
    handleDeleteRequest,
  };
}