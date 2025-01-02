import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

  if (signUpError) throw signUpError;
  if (!signUpData.user) throw new Error("Erreur lors de la création du compte");

  await updateClientProfile(signUpData.user.id, formData);
  if (formData.idDocument) {
    await uploadIdDocument(signUpData.user.id, formData.idDocument);
  }
  await insertClientConsents(signUpData.user.id, formData.acceptedConsents);

  return signUpData;
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