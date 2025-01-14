import { supabase } from "@/integrations/supabase/client";

export async function fetchClientProfile(userId: string, userEmail: string | undefined) {
  try {
    console.log('Fetching client profile for user:', userId, 'email:', userEmail);
    
    const { data: existingProfile, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching client profile:', fetchError);
      throw fetchError;
    }

    if (existingProfile) {
      console.log('Existing profile found:', existingProfile);
      // Si l'email n'est pas défini dans le profil mais qu'on a un email dans userEmail
      if (!existingProfile.email && userEmail) {
        const { error: updateError } = await supabase
          .from('clients')
          .update({ email: userEmail })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating client email:', updateError);
        } else {
          existingProfile.email = userEmail;
        }
      }
      return existingProfile;
    }

    // Si aucun profil n'existe, on en crée un nouveau
    const { data: newProfile, error: createError } = await supabase
      .from('clients')
      .insert([
        {
          id: userId,
          email: userEmail,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating client profile:', createError);
      throw createError;
    }

    console.log('New profile created:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error in fetchClientProfile:', error);
    throw error;
  }
}