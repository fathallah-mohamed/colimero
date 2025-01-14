import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useApprovalActions() {
  const { toast } = useToast();

  const handleApproveRequest = async (request: any) => {
    try {
      const { error: updateError } = await supabase
        .from('approval_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      const { data: bookingData, error: bookingError } = await supabase
        .rpc('create_booking_with_capacity_update', {
          p_tour_id: request.tour_id,
          p_user_id: request.user_id,
          p_weight: 5,
          p_pickup_city: request.pickup_city || request.tour.route[0].name,
          p_delivery_city: request.delivery_city || request.tour.route[request.tour.route.length - 1].name,
          p_recipient_name: `${request.user.first_name} ${request.user.last_name}`,
          p_recipient_address: "À renseigner",
          p_recipient_phone: request.user.phone || "À renseigner",
          p_sender_name: `${request.user.first_name} ${request.user.last_name}`,
          p_sender_phone: request.user.phone || "À renseigner",
          p_item_type: "Colis standard",
          p_special_items: "[]",
          p_content_types: [],
          p_photos: []
        });

      if (bookingError) throw bookingError;

      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée et une réservation a été créée",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation",
      });
      return { success: false, error };
    }
  };

  const handleRejectRequest = async (request: any) => {
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
        description: error.message || "Une erreur est survenue lors du rejet",
      });
      return { success: false, error };
    }
  };

  return {
    handleApproveRequest,
    handleRejectRequest,
  };
}