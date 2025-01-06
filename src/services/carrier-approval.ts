import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

// Create an admin client with the service role key
const adminAuthClient = createClient(
  "https://dsmahpgrhjoikcxuiqrw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbWFocGdyaGpvaWtjeHVpcXJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDkwMjcxMCwiZXhwIjoyMDUwNDc4NzEwfQ.9YDEN41__xBHL8NY7kR5eJqP9vHdZUEqZQUUoVaK4HU",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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

    // First create the auth user using the admin client
    const { error: authError } = await adminAuthClient.auth.admin.createUser({
      email: request.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: request.first_name,
        last_name: request.last_name,
        company_name: request.company_name,
        user_type: 'carrier'
      }
    });

    if (authError) throw authError;

    // Wait a moment for the auth user to be created
    await new Promise(resolve => setTimeout(resolve, 2000));

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