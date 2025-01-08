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

    // Call the edge function to handle the approval process
    const { data, error } = await supabase.functions.invoke("approve-carrier", {
      body: { requestId }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Failed to approve carrier");

    console.log("Carrier created successfully:", data.carrier);
    return data.carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}