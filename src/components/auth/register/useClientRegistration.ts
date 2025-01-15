import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";
import { useToast } from "@/hooks/use-toast";

export async function registerClient(formData: RegisterFormState) {
  console.log("Starting client registration with data:", {
    ...formData,
    password: "[REDACTED]"
  });

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          birth_date: formData.birthDate,
          address: formData.address
        },
      },
    });

    console.log("Auth signup response:", { data: authData, error: authError });

    if (authError) {
      if (authError.message.includes("User already registered") || 
          authError.message === "User already registered" ||
          authError.message.includes("already exists")) {
        return { data: null, error: { message: "User already registered" } };
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    // 2. Upload ID document if provided
    if (formData.idDocument) {
      console.log("Uploading ID document...");
      await uploadIdDocument(authData.user.id, formData.idDocument);
    }

    // 3. Insert client consents
    console.log("Inserting client consents...");
    await insertClientConsents(authData.user.id, formData.acceptedConsents);

    // 4. Send activation email
    console.log("Sending activation email...");
    const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
      body: {
        email: formData.email,
        first_name: formData.firstName
      }
    });

    if (emailError) {
      console.error("Error sending activation email:", emailError);
      throw new Error("Erreur lors de l'envoi de l'email d'activation");
    }

    return { data: authData, error: null };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { data: null, error };
  }
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
  const consentsToUpsert = acceptedConsents.map(consentId => ({
    client_id: userId,
    consent_type_id: consentId,
    accepted: true,
    accepted_at: new Date().toISOString()
  }));

  const { error: consentsError } = await supabase
    .from('client_consents')
    .upsert(consentsToUpsert, {
      onConflict: 'client_id,consent_type_id',
      ignoreDuplicates: false
    });

  if (consentsError) throw consentsError;
}