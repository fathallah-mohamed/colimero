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

    // Create the auth user first using admin API
    const { error: createUserError } = await supabase.auth.admin.createUser({
      email: request.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        user_type: 'carrier',
        first_name: request.first_name,
        last_name: request.last_name,
        company_name: request.company_name
      },
      app_metadata: {
        provider: 'email',
        providers: ['email']
      }
    });

    if (createUserError) {
      console.error("Error creating auth user:", createUserError);
      throw new Error("Failed to create user account");
    }

    // Update request status after user creation
    const { error: updateError } = await supabase
      .from("carrier_registration_requests")
      .update({ 
        status: "approved",
        email_verified: true,
        password: tempPassword
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Wait briefly for triggers to complete
    console.log("Waiting for triggers to complete...");
    await new Promise(resolve => setTimeout(resolve, 2000));

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

    // Send approval email
    const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
      body: JSON.stringify({
        email: request.email,
        company_name: request.company_name,
        password: tempPassword
      }),
    });

    if (emailError) {
      console.error("Error sending approval email:", emailError);
      // Don't throw here, as the carrier was still created successfully
    }

    console.log("Carrier created successfully:", carrier);
    return carrier;
  } catch (error: any) {
    console.error("Error in approveCarrierRequest:", error);
    throw new Error(error.message || "Failed to approve carrier request");
  }
}