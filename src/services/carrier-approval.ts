import { supabase } from "@/integrations/supabase/client";

export async function approveCarrierRequest(carrierId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session");

    const { data: carrier, error: carrierError } = await supabase
      .from("carriers")
      .select("*")
      .eq("id", carrierId)
      .single();

    if (carrierError) throw carrierError;
    if (!carrier) throw new Error("Carrier not found");

    console.log("Found carrier:", carrier);

    const { error } = await supabase.rpc('approve_carrier', {
      carrier_id: carrierId,
      admin_id: session.user.id
    });

    if (error) throw error;

    return carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}