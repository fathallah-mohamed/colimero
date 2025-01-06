import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(requestId: string) {
  try {
    // First, verify the request exists and get its data
    const { data: request, error: requestError } = await supabase
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError) throw requestError;
    if (!request) throw new Error("Request not found");

    // Update request status to trigger auth user creation
    const { error: updateError } = await supabase
      .from("carrier_registration_requests")
      .update({ 
        status: "approved",
        email_verified: true 
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Wait for database triggers to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify carrier was created
    const { data: carrier, error: verifyError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", requestId)
      .single();

    if (verifyError) throw verifyError;
    if (!carrier) {
      throw new Error("Carrier creation failed - please try again");
    }

    console.log("Carrier created successfully:", carrier);
    return carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}