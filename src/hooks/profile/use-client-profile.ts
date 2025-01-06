import { supabase } from "@/integrations/supabase/client";

export async function fetchClientProfile(userId: string, userEmail: string | undefined) {
  // Vérifie d'abord si le profil existe
  const { data: existingProfile, error: fetchError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  // Si le profil n'existe pas, on le crée
  if (!existingProfile) {
    const { data: userData } = await supabase.auth.getUser();
    const metadata = userData?.user?.user_metadata || {};

    const { data: newProfile, error: insertError } = await supabase
      .from('clients')
      .insert([
        {
          id: userId,
          email: userEmail,
          first_name: metadata.first_name || null,
          last_name: metadata.last_name || null,
          phone: metadata.phone || null,
          address: metadata.address || null,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return newProfile;
  }

  return existingProfile;
}