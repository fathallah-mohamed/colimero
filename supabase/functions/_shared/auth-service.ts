import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CarrierRequest, AuthUser } from "./types.ts";

export async function createAuthUser(
  supabaseClient: ReturnType<typeof createClient>,
  request: CarrierRequest,
  password: string
): Promise<AuthUser> {
  const { data: authUser, error: createUserError } = await supabaseClient.auth.admin.createUser({
    email: request.email,
    password: password,
    email_confirm: true,
    user_metadata: {
      user_type: 'carrier',
      first_name: request.first_name,
      last_name: request.last_name,
      company_name: request.company_name
    }
  });

  if (createUserError) throw createUserError;
  if (!authUser) throw new Error("Failed to create auth user");

  return authUser;
}