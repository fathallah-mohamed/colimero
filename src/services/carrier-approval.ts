import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(carrierId: string, adminId: string) {
  console.log("Approving carrier request:", { carrierId, adminId });
  
  const { error } = await supabase.rpc('approve_carrier', {
    carrier_id: carrierId,
    admin_id: adminId
  });

  if (error) {
    console.error("Error in approveCarrierRequest:", error);
    throw error;
  }

  // Send approval email
  try {
    const { data: carrierData } = await supabase
      .from('carriers')
      .select('email, company_name')
      .eq('id', carrierId)
      .single();

    if (carrierData) {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email: carrierData.email,
          company_name: carrierData.company_name
        }
      });
    }
  } catch (emailError) {
    console.error("Error sending approval email:", emailError);
    // Don't throw here, as the approval was successful
  }
}

export async function rejectCarrierRequest(carrierId: string, adminId: string, reason: string) {
  console.log("Rejecting carrier request:", { carrierId, adminId, reason });
  
  const { error } = await supabase.rpc('reject_carrier', {
    carrier_id: carrierId,
    admin_id: adminId,
    rejection_reason: reason
  });

  if (error) {
    console.error("Error in rejectCarrierRequest:", error);
    throw error;
  }

  // Send rejection email
  try {
    const { data: carrierData } = await supabase
      .from('carriers')
      .select('email, company_name')
      .eq('id', carrierId)
      .single();

    if (carrierData) {
      await supabase.functions.invoke('send-rejection-email', {
        body: {
          email: carrierData.email,
          company_name: carrierData.company_name,
          reason: reason
        }
      });
    }
  } catch (emailError) {
    console.error("Error sending rejection email:", emailError);
    // Don't throw here, as the rejection was successful
  }
}