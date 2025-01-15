import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";
import { useToast } from "@/hooks/use-toast";

export async function registerClient(formData: RegisterFormState) {
  console.log("Starting client registration with data:", {
    ...formData,
    password: "[REDACTED]"
  });

  try {
    // 1. Create auth user with proper metadata
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
      const fileExt = formData.idDocument.name.split('.').pop();
      const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(fileName, formData.idDocument);

      if (uploadError) throw uploadError;
    }

    // 3. Insert client consents
    console.log("Inserting client consents...");
    const consentsToInsert = formData.acceptedConsents.map(consentId => ({
      client_id: authData.user.id,
      consent_type_id: consentId,
      accepted: true,
      accepted_at: new Date().toISOString()
    }));

    if (consentsToInsert.length > 0) {
      const { error: consentsError } = await supabase
        .from('client_consents')
        .upsert(consentsToInsert);

      if (consentsError) throw consentsError;
    }

    return { data: authData, error: null };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { data: null, error };
  }
}