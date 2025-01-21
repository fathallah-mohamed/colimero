import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "./approval-requests/types";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        console.log('No user ID provided');
        setRequests([]);
        return;
      }

      console.log('Fetching requests for user:', userId, 'type:', userType);
      
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

      if (userType === 'carrier') {
        query = query.eq('tour.carrier_id', userId);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching approval requests:', fetchError);
        setError(fetchError.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les demandes d'approbation"
        });
        setRequests([]);
        return;
      }

      console.log('Fetched approval requests:', data);
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error in fetchRequests:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des demandes"
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRequests();
    } else {
      setLoading(false);
      setRequests([]);
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
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès",
      });

      await fetchRequests();
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

      await fetchRequests();
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

  return { 
    requests, 
    loading,
    error,
    handleApproveRequest,
    handleRejectRequest
  };
}