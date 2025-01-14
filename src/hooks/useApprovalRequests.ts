import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApprovalActions } from "./useApprovalActions";
import { useRequestManagement } from "./useRequestManagement";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const { handleApproveRequest, handleRejectRequest } = useApprovalActions();
  const { handleCancelRequest, handleDeleteRequest } = useRequestManagement();

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
    } finally {
      setLoading(false);
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