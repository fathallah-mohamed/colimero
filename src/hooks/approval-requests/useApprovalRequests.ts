import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useApprovalActions } from "./useApprovalActions";
import { ApprovalRequest, FetchedApprovalRequest } from "./types";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const { handleApproveRequest, handleRejectRequest } = useApprovalActions();
  const { toast } = useToast();

  const mapToApprovalRequest = (data: FetchedApprovalRequest[]): ApprovalRequest[] => {
    return data.map(item => ({
      ...item,
      client: item.user[0],
      tour: {
        ...item.tour,
        route: Array.isArray(item.tour.route) ? item.tour.route : [],
        carriers: item.tour.carrier
      }
    }));
  };

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
            route,
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
      setRequests(mapToApprovalRequest(data as FetchedApprovalRequest[]));
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

  const handleAction = async (actionFn: Function, request: ApprovalRequest) => {
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
    handleApproveRequest: async (request: ApprovalRequest) => handleAction(handleApproveRequest, request),
    handleRejectRequest: async (request: ApprovalRequest) => handleAction(handleRejectRequest, request)
  };
}