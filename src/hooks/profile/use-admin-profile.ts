import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export async function fetchAdminProfile(userId: string, userEmail: string | undefined) {
  const { data: adminData, error: adminError } = await supabase
    .from('administrators')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (adminError) {
    console.error('Error fetching admin profile:', adminError);
    throw adminError;
  }

  if (adminData) {
    return {
      id: adminData.id,
      first_name: adminData.first_name || '',
      last_name: adminData.last_name || '',
      phone: adminData.phone || '',
      email: userEmail || '',
      address: adminData.address || '',
      created_at: adminData.created_at
    };
  }

  return null;
}

export async function createAdminProfile(userId: string, userEmail: string | undefined, metadata: any) {
  const { data: newAdminData, error: insertError } = await supabase
    .from('administrators')
    .insert([
      {
        id: userId,
        email: userEmail,
        first_name: metadata?.first_name || '',
        last_name: metadata?.last_name || '',
        address: 'À renseigner'
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating admin profile:', insertError);
    throw insertError;
  }

  if (newAdminData) {
    return {
      id: newAdminData.id,
      first_name: newAdminData.first_name || '',
      last_name: newAdminData.last_name || '',
      phone: newAdminData.phone || '',
      email: userEmail || '',
      address: newAdminData.address || '',
      created_at: newAdminData.created_at
    };
  }

  return null;
}

export function useAdminProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Error in admin profile:', error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger votre profil administrateur",
    });
    setLoading(false);
  };

  return {
    loading,
    setLoading,
    profile,
    setProfile,
    handleError
  };
}