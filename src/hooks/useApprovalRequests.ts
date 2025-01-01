import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchRequests = async () => {
    if (!userId) return;

    try {
      let query;
      
      if (userType === 'carrier') {
        // Fetch requests for carrier's tours
        const { data: approvalData, error: approvalError } = await supabase
          .from('approval_requests')
          .select(`
            *,
            tour:tours (
              departure_country,
              destination_country,
              departure_date,
              route,
              total_capacity,
              remaining_capacity,
              carriers (
                company_name
              )
            )
          `)
          .eq('tour.carrier_id', userId)
          .order('created_at', { ascending: false });

        if (approvalError) throw approvalError;

        // Fetch client data for each request
        if (approvalData) {
          const requestsWithUserData = await Promise.all(
            approvalData.map(async (request) => {
              const { data: userData } = await supabase
                .from('clients')
                .select('first_name, last_name, phone')
                .eq('id', request.user_id)
                .single();

              return {
                ...request,
                user: userData
              };
            })
          );

          setRequests(requestsWithUserData);
        }
      } else {
        // Fetch client's requests
        const { data, error } = await supabase
          .from('approval_requests')
          .select(`
            *,
            tour:tours (
              departure_country,
              destination_country,
              departure_date,
              route,
              total_capacity,
              remaining_capacity,
              carriers (
                company_name
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      }
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

  const checkExistingRequest = async (tourId: string) => {
    const { data, error } = await supabase
      .from('approval_requests')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tourId);

    if (error) {
      console.error('Error checking existing request:', error);
      return true; // En cas d'erreur, on empêche la création par précaution
    }

    // Retourne true s'il existe une demande en attente ou approuvée
    return data?.some(request => 
      request.status === 'pending' || request.status === 'approved'
    ) || false;
  };

  const handleApproval = async (requestId: string, approved: boolean) => {
    const { error } = await supabase
      .from('approval_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la demande.",
      });
      return;
    }

    toast({
      title: "Succès",
      description: `La demande a été ${approved ? 'approuvée' : 'rejetée'} avec succès.`,
    });

    fetchRequests();
  };

  const handleCancelRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('approval_requests')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la demande.",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La demande a été annulée avec succès.",
    });

    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  return { 
    requests, 
    loading, 
    handleApproval,
    handleCancelRequest,
    checkExistingRequest
  };
}