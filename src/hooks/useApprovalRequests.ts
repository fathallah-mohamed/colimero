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
            carrier:carriers (
              id,
              company_name
            )
          ),
          user:clients (
            first_name,
            last_name,
            phone
          )
        `);

      // Apply filter based on user type
      if (userType === 'carrier') {
        query = query.eq('tours.carrier_id', userId);
      } else if (userType === 'client') {
        query = query.eq('user_id', userId);
      }

      const { data: approvalData, error } = await query;

      if (error) {
        console.error('Error fetching approval requests:', error);
        throw error;
      }

      console.log('Fetched approval requests:', approvalData);
      setRequests(approvalData || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les demandes d'approbation",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: isApproved ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `La demande a été ${isApproved ? 'approuvée' : 'rejetée'} avec succès`,
      });

      await fetchRequests();
    } catch (error) {
      console.error('Error handling approval:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la demande",
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
    } catch (error) {
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
        .single();

      if (checkError) throw checkError;

      if (request.status !== 'cancelled') {
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
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la demande",
      });
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with userId:', userId);
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  return { 
    requests, 
    loading,
    handleApproval,
    handleCancelRequest,
    handleDeleteRequest
  };
}