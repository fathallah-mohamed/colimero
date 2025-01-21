import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

export function useFetchRequests(userType: string | null, userId: string | null) {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      // Si c'est un transporteur, on filtre par carrier_id
      if (userType === 'carrier') {
        query = query.eq('tour.carrier_id', userId);
      } else {
        // Si c'est un client, on filtre par user_id
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

      const mappedRequests = data?.map(request => ({
        ...request,
        tour: {
          ...request.tour,
          carrier: request.tour?.carrier
        }
      })) as ApprovalRequest[];

      console.log('Fetched requests:', mappedRequests);
      setRequests(mappedRequests || []);
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

  return { requests, loading, error, refetchRequests: fetchRequests };
}