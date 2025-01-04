import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";

export async function fetchAdminProfile(userId: string, userEmail: string | undefined) {
  try {
    console.log('Fetching admin profile for user:', userId);
    
    const { data: adminData, error: adminError } = await supabase
      .from('administrators')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (adminError) {
      console.error('Error fetching admin profile:', adminError);
      throw adminError;
    }

    console.log('Admin data retrieved:', adminData);

    if (adminData) {
      return {
        id: adminData.id,
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        phone: adminData.phone || '',
        email: userEmail || '',
        address: adminData.address,
        created_at: adminData.created_at
      };
    }

    return null;
  } catch (error) {
    console.error('Error in fetchAdminProfile:', error);
    throw error;
  }
}

export async function createAdminProfile(userId: string, userEmail: string | undefined, metadata: any) {
  try {
    console.log('Creating admin profile with metadata:', metadata);
    
    const { data: newAdminData, error: insertError } = await supabase
      .from('administrators')
      .insert([
        {
          id: userId,
          email: userEmail,
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          address: metadata?.address || 'À renseigner',
          phone: metadata?.phone || ''
        }
      ])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Error creating admin profile:', insertError);
      throw insertError;
    }

    console.log('New admin profile created:', newAdminData);

    if (newAdminData) {
      return {
        id: newAdminData.id,
        first_name: newAdminData.first_name,
        last_name: newAdminData.last_name,
        phone: newAdminData.phone || '',
        email: userEmail || '',
        address: newAdminData.address,
        created_at: newAdminData.created_at
      };
    }

    return null;
  } catch (error) {
    console.error('Error in createAdminProfile:', error);
    throw error;
  }
}