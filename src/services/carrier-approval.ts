import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(carrierId: string, adminId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session");

    const { error } = await supabase.rpc('approve_carrier', {
      carrier_id: carrierId,
      admin_id: adminId
    });

    if (error) throw error;

    // Send approval email
    await supabase.functions.invoke('send-approval-email', {
      body: { carrierId }
    });

  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}

export async function rejectCarrierRequest(carrierId: string, adminId: string, reason: string) {
  try {
    const { error } = await supabase.rpc('reject_carrier', {
      carrier_id: carrierId,
      admin_id: adminId,
      rejection_reason: reason
    });

    if (error) throw error;

    // Send rejection email
    await supabase.functions.invoke('send-rejection-email', {
      body: { carrierId, reason }
    });

  } catch (error: any) {
    console.error("Error in rejectCarrierRequest:", error);
    throw new Error(error.message || "Failed to reject carrier request");
  }
}