import { supabase } from "@/integrations/supabase/client";

export async function fetchClientProfile(userId: string, userEmail: string | undefined) {
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', userId)
    .single();

  if (clientError) throw clientError;
  
  if (clientData) {
    return {
      id: clientData.id,
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      phone: clientData.phone,
      email: userEmail,
      created_at: clientData.created_at,
      birth_date: clientData.birth_date,
      address: clientData.address,
      id_document: clientData.id_document
    };
  }

  return null;
}