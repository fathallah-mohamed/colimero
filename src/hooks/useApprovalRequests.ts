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
      let query = supabase
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
          ),
          user:users!inner (
            first_name:raw_user_meta_data->first_name,
            last_name:raw_user_meta_data->last_name,
            phone:raw_user_meta_data->phone
          )
        `)
        .order('created_at', { ascending: false });

      if (userType === 'carrier') {
        // Pour les transporteurs, filtrer par les demandes liées à leurs tournées
        query = query.eq('tour.carrier_id', userId);
      } else {
        // Pour les clients, filtrer par leurs propres demandes
        query = query.eq('user_id', userId);
      }

      const { data: approvalData, error: approvalError } = await query;

      if (approvalError) {
        console.error('Error details:', approvalError);
        throw approvalError;
      }
      
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

  const checkExistingRequest = async (tourId: string) => {
    const { data, error } = await supabase
      .from('approval_requests')
      .select('id, status')
      .eq('user_id', userId)
      .eq('tour_id', tourId);

    if (error) {
      console.error('Error checking existing request:', error);
      return { exists: true, status: null }; // En cas d'erreur, on empêche la création par précaution
    }

    const pendingOrApproved = data?.find(request => 
      request.status === 'pending' || request.status === 'approved'
    );

    if (pendingOrApproved) {
      return { exists: true, status: pendingOrApproved.status };
    }

    const rejected = data?.find(request => request.status === 'rejected');
    if (rejected) {
      return { exists: true, status: 'rejected' };
    }

    return { exists: false, status: null };
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