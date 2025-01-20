import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApprovalActions } from "./useApprovalActions";
import { useRequestManagement } from "./useRequestManagement";
import { useToast } from "./use-toast";
import { ApprovalRequest, Client } from "@/components/admin/approval-requests/types";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const { handleApproveRequest, handleRejectRequest } = useApprovalActions();
  const { handleCancelRequest, handleDeleteRequest } = useRequestManagement();
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
            id,
            departure_country,
            destination_country,
            departure_date,
            collection_date,
            total_capacity,
            remaining_capacity,
            type,
            carrier:carriers (
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

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching approval requests:', fetchError);
        setError(fetchError.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos demandes d'approbation"
        });
        setRequests([]);
        return;
      }

      console.log('Fetched approval requests:', data);

      // Map the data to match our ApprovalRequest type
      const mappedRequests: ApprovalRequest[] = (data || []).map(item => ({
        ...item,
        client: item.user as Client, // Map user to client
        user_id: item.user_id,
        tour: {
          ...item.tour,
          carriers: item.tour.carrier
        }
      }));

      setRequests(mappedRequests);
    } catch (error: any) {
      console.error('Error in fetchRequests:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement de vos demandes"
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with userId:', userId, 'userType:', userType);
    if (userId) {
      fetchRequests();
    } else {
      setLoading(false);
      setRequests([]);
    }
  }, [userId, userType]);

  const handleAction = async (actionFn: Function, request: any) => {
    try {
      const result = await actionFn(request);
      if (result?.success) {
        await fetchRequests();
      }
      return result;
    } catch (error) {
      console.error('Error handling action:', error);
      return { success: false, error };
    }
  };

  return { 
    requests, 
    loading,
    error,
    handleApproveRequest: async (request: any) => handleAction(handleApproveRequest, request),
    handleRejectRequest: async (request: any) => handleAction(handleRejectRequest, request),
    handleCancelRequest: async (requestId: string) => handleAction(handleCancelRequest, requestId),
    handleDeleteRequest: async (requestId: string) => handleAction(handleDeleteRequest, requestId)
  };
}