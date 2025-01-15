import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export function useUserData(userType: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        let profileData;
        if (userType === 'admin') {
          const { data, error } = await supabase
            .from('administrators')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching admin profile:', error);
            return;
          }
          profileData = data;
          
        } else if (userType === 'carrier') {
          const { data, error } = await supabase
            .from('carriers')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching carrier profile:', error);
            return;
          }
          profileData = data;
          
        } else {
          const { data, error } = await supabase
            .from('clients')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching client profile:', error);
            return;
          }
          profileData = data;
        }

        if (profileData) {
          setUserData(profileData);
        } else {
          console.log(`No ${userType} profile found for user:`, user.id);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    if (userType) {
      fetchUserData();
    }
  }, [userType]);

  return userData;
}