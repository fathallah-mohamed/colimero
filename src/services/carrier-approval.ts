import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(carrierId: string, adminId: string) {
  const { error } = await supabase.rpc('approve_carrier', {
    carrier_id: carrierId,
    admin_id: adminId
  });

  if (error) throw error;
}

export async function rejectCarrierRequest(carrierId: string, adminId: string, reason: string) {
  const { error } = await supabase.rpc('reject_carrier', {
    carrier_id: carrierId,
    admin_id: adminId,
    rejection_reason: reason
  });

  if (error) throw error;
}