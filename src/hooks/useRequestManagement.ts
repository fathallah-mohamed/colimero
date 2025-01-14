import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRequestManagement() {
  const { toast } = useToast();

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
        title: "Succès",
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
      const { error: checkError, data: request } = await supabase
        .from('approval_requests')
        .select('status')
        .eq('id', requestId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (request?.status !== 'cancelled') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Seules les demandes annulées peuvent être supprimées",
        });
        return { success: false };
      }

      const { error } = await supabase
        .from('approval_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Succès",
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
    handleCancelRequest,
    handleDeleteRequest,
  };
}