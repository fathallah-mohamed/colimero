import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

export function useClientApprovalRequests(userId: string | undefined) {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching requests for user:', userId);
      
      const { data, error } = await supabase
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
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching requests:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les demandes d'approbation"
        });
        return;
      }

      console.log('Fetched requests:', data);
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error in fetchRequests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des demandes"
      });
    } finally {
      setLoading(false);
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
        .eq('id', requestId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été annulée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation"
      });
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', userId)
        .eq('status', 'cancelled');

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été supprimée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      });
    }
  };

  return {
    requests,
    loading,
    handleCancelRequest,
    handleDeleteRequest,
    refetchRequests: fetchRequests
  };
}