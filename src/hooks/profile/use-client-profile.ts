import { supabase } from "@/integrations/supabase/client";

export async function fetchClientProfile(userId: string, userEmail: string | undefined) {
  try {
    // First attempt to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }

    // If no profile exists, try to create one
    const { data: userData } = await supabase.auth.getUser();
    const metadata = userData?.user?.user_metadata || {};

    const { data: newProfile, error: upsertError } = await supabase
      .from('clients')
      .upsert([
        {
          id: userId,
          email: userEmail,
          first_name: metadata.first_name || null,
          last_name: metadata.last_name || null,
          phone: metadata.phone || null,
          address: metadata.address || null,
          status: 'active'
        }
      ], 
      { 
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (upsertError) throw upsertError;
    return newProfile;
    
  } catch (error) {
    console.error('Error in fetchClientProfile:', error);
    throw error;
  }
}