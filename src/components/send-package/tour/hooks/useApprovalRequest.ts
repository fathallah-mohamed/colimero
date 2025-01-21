import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useApprovalRequest(tourId: number) {
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingRequest();
  }, [tourId]);

  const checkExistingRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: request, error } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('tour_id', tourId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing request:', error);
      return;
    }

    console.log('Existing request:', request);
    setExistingRequest(request);
  };

  return {
    existingRequest,
    checkExistingRequest
  };
}