import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: 'client'
        },
      },
    });

    if (error) {
      // Check specifically for user already exists error
      if (error.message.includes("User already registered") || 
          error.message === "User already registered" ||
          error.message.includes("already exists")) {
        return { data: null, error: { message: "User already registered" } };
      }
      throw error;
    }

    if (!data.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    await updateClientProfile(data.user.id, formData);
    if (formData.idDocument) {
      await uploadIdDocument(data.user.id, formData.idDocument);
    }
    await insertClientConsents(data.user.id, formData.acceptedConsents);

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

async function updateClientProfile(userId: string, formData: RegisterFormState) {
  const { error: clientError } = await supabase
    .from('clients')
    .update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      birth_date: formData.birthDate || null,
      address: formData.address || null,
    })
    .eq('id', userId);

  if (clientError) throw clientError;
}

async function uploadIdDocument(userId: string, idDocument: File) {
  const fileExt = idDocument.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('id-documents')
    .upload(fileName, idDocument);

  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase
    .from('clients')
    .update({
      id_document: fileName
    })
    .eq('id', userId);

  if (updateError) throw updateError;
}

async function insertClientConsents(userId: string, acceptedConsents: string[]) {
  const consentsToInsert = acceptedConsents.map(consentId => ({
    client_id: userId,
    consent_type_id: consentId,
    accepted: true,
    accepted_at: new Date().toISOString()
  }));

  const { error: consentsError } = await supabase
    .from('client_consents')
    .insert(consentsToInsert);

  if (consentsError) throw consentsError;
}