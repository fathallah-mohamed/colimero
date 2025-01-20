import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApprovalActions } from "./useApprovalActions";
import { useRequestManagement } from "./useRequestManagement";
import { useToast } from "./use-toast";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const { handleApproveRequest, handleRejectRequest } = useApprovalActions();
  const { handleCancelRequest, handleDeleteRequest } = useRequestManagement();
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
          )
        `);

      if (userType === 'carrier') {
        console.log('Filtering for carrier:', userId);
        query = query.eq('tour.carrier_id', userId);
      } else {
        console.log('Filtering for client:', userId);
        query = query.eq('user_id', userId);
      }

      const { data: approvalData, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching approval requests:', fetchError);
        setError(fetchError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos demandes d'approbation"
        });
        setLoading(false);
        return;
      }

      console.log('Approval data received:', approvalData);

      if (approvalData) {
        const requestsWithUserData = await Promise.all(
          approvalData.map(async (request) => {
            const { data: userData, error: userError } = await supabase
              .from('clients')
              .select('id, first_name, last_name, email, phone')
              .eq('id', request.user_id)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              return {
                ...request,
                user: {
                  id: request.user_id,
                  first_name: 'Utilisateur',
                  last_name: 'Inconnu',
                  email: '',
                  phone: ''
                }
              };
            }

            return {
              ...request,
              user: userData
            };
          })
        );

        console.log('Fetched approval requests with user data:', requestsWithUserData);
        setRequests(requestsWithUserData);
        setError(null);
      } else {
        setRequests([]);
      }
    } catch (err: any) {
      console.error('Error in fetchRequests:', err);
      setError(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement de vos demandes"
      });
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
    }
  }, [userId, userType]);

  return { 
    requests, 
    loading,
    error,
    handleApproveRequest: async (request: any) => {
      const { success } = await handleApproveRequest(request);
      if (success) await fetchRequests();
    },
    handleRejectRequest: async (request: any) => {
      const { success } = await handleRejectRequest(request);
      if (success) await fetchRequests();
    },
    handleCancelRequest: async (requestId: string) => {
      const { success } = await handleCancelRequest(requestId);
      if (success) await fetchRequests();
    },
    handleDeleteRequest: async (requestId: string) => {
      const { success } = await handleDeleteRequest(requestId);
      if (success) await fetchRequests();
    }
  };
}