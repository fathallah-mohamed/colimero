import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(requestId: string) {
  try {
    // First, verify the request exists and get its data
    const { data: request, error: requestError } = await supabase
      .from("carrier_registration_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;
    if (!request) throw new Error("Request not found");

    console.log("Found carrier request:", request);

    // Generate a random password for the new user
    const tempPassword = Math.random().toString(36).slice(-8);

    // Update request status to trigger carrier creation
    const { error: updateError } = await supabase
      .from("carrier_registration_requests")
      .update({ 
        status: "approved",
        email_verified: true,
        password: tempPassword
      })
      .eq("id", requestId);

    if (updateError) throw updateError;
    console.log("Updated request status to approved");

    // Wait for database triggers to complete
    console.log("Waiting for triggers to complete...");
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Verify carrier was created
    const { data: carrier, error: verifyError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (verifyError) throw verifyError;
    if (!carrier) {
      console.error("Carrier not found after waiting for triggers");
      throw new Error("Carrier creation failed - please try again");
    }

    console.log("Carrier created successfully:", carrier);
    return carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}