import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  console.log("Starting registration process with data:", {
    ...formData,
    password: "[REDACTED]"
  });

  try {
    // 1. Create auth user with proper metadata
    const signUpData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim(),
          birth_date: formData.birthDate,
          address: formData.address?.trim()
        },
      },
    };

    console.log("Attempting signUp with data:", {
      ...signUpData,
      password: "[REDACTED]"
    });

    const { data: authData, error: authError } = await supabase.auth.signUp(signUpData);

    console.log("SignUp response:", { data: authData, error: authError });

    if (authError) {
      console.error("Auth error details:", {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      return { data: null, error: authError };
    }

    if (!authData.user) {
      throw new Error("No user data received");
    }

    console.log("Auth successful, user created:", authData.user.id);

    // 2. Upload ID document if provided
    if (formData.idDocument) {
      console.log("Uploading ID document...");
      const fileExt = formData.idDocument.name.split('.').pop();
      const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(fileName, formData.idDocument);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
    }

    // 3. Insert client consents
    if (formData.acceptedConsents.length > 0) {
      console.log("Inserting client consents...");
      const consentsToInsert = formData.acceptedConsents.map(consentId => ({
        client_id: authData.user.id,
        consent_type_id: consentId,
        accepted: true,
        accepted_at: new Date().toISOString()
      }));

      const { error: consentsError } = await supabase
        .from('client_consents')
        .upsert(consentsToInsert);

      if (consentsError) {
        console.error("Consents error:", consentsError);
        throw consentsError;
      }
    }

    return { data: authData, error: null };
  } catch (error: any) {
    console.error("Complete registration error:", error);
    return { data: null, error };
  }
}