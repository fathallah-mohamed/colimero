import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(carrierId: string) {
  try {
    // First, verify the carrier exists and get its data
    const { data: carrier, error: carrierError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", carrierId)
      .maybeSingle();

    if (carrierError) throw carrierError;
    if (!carrier) throw new Error("Carrier not found");

    console.log("Found carrier:", carrier);

    // Call the edge function to handle the approval process
    const { data, error } = await supabase.functions.invoke("approve-carrier", {
      body: { carrierId }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Failed to approve carrier");

    console.log("Carrier approved successfully:", data.carrier);
    return data.carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}