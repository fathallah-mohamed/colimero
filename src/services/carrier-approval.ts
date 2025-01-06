import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(requestId: string) {
  // Update request status
  const { error: updateError } = await supabase
    .from("carrier_registration_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  if (updateError) {
    console.error("Error updating request:", updateError);
    throw updateError;
  }

  // Wait for triggers to complete
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Verify carrier was created
  const { data: carrier, error: verifyError } = await supabase
    .from("carriers")
    .select("*")
    .eq("id", requestId)
    .maybeSingle();

  if (verifyError) {
    console.error("Error verifying carrier creation:", verifyError);
    throw verifyError;
  }

  if (!carrier) {
    throw new Error("Carrier was not created successfully");
  }

  return carrier;
}