import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchRequests = async () => {
    if (!userId) {
      console.log('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching requests for user:', userId, 'type:', userType);
      
      let query = supabase
        .from('approval_requests')
        .select(`
          *,
          tour:tours (
            id,
            departure_country,
            destination_country,
            departure_date,
            collection_date,
            route,
            total_capacity,
            remaining_capacity,
            type,
            carriers (
              id,
              company_name,
              email,
              phone
            )
          ),
          user:clients (
            id,
            first_name,
            last_name,
            phone,
            email
          )
        `);

      if (userType === 'carrier') {
        query = query.eq('tour.carrier_id', userId);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data: approvalData, error } = await query;

      if (error) throw error;

      console.log('Fetched approval requests:', approvalData);
      setRequests(approvalData || []);
    } catch (error: any) {
      console.error('Error in fetchRequests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les demandes d'approbation",
      });
    } finally {
      setLoading(false);
    }
  };

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

      // Créer une réservation automatiquement pour le client
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: request.user_id,
          tour_id: request.tour_id,
          pickup_city: request.pickup_city || request.tour.route[0].name,
          delivery_city: request.delivery_city || request.tour.route[request.tour.route.length - 1].name,
          status: 'confirmed',
          approval_request_id: request.id
        });

      if (bookingError) throw bookingError;

      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée et une réservation a été créée",
      });

      await fetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation",
      });
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

      await fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet",
      });
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
        title: "Succès",
        description: "La demande a été annulée avec succès",
      });

      await fetchRequests();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la demande",
      });
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
        return;
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

      await fetchRequests();
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la demande",
      });
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with userId:', userId, 'userType:', userType);
    if (userId) {
      fetchRequests();
    }
  }, [userId, userType]);

  return { 
    requests, 
    loading,
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest
  };
}