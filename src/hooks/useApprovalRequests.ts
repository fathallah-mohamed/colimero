import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching requests for:', { userType, userId });

      let query = supabase
        .from('approval_requests')
        .select(`
          *,
          tour:tours (
            *,
            carrier:carriers (
              id,
              company_name,
              email,
              phone
            )
          ),
          client:clients (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `);

      // Filter based on user type
      if (userType === 'client') {
        query = query.eq('user_id', userId);
      } else if (userType === 'carrier') {
        query = query.eq('tour.carrier_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      console.log('Fetched requests:', data);
      setRequests(data || []);
    } catch (err) {
      console.error('Error in fetchRequests:', err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les demandes d'approbation"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userType) {
      fetchRequests();
    }
  }, [userId, userType]);

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
        description: "La demande a été approuvée"
      });
      
      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation"
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
        description: "La demande a été rejetée"
      });
      
      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet"
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
        title: "Succès",
        description: "La demande a été annulée"
      });
      
      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation"
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
        title: "Succès",
        description: "La demande a été supprimée"
      });
      
      await fetchRequests();
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      });
      return { success: false, error };
    }
  };

  return {
    requests,
    loading,
    error,
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest,
    refetchRequests: fetchRequests
  };
}