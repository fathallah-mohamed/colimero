import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function useUserData(userType: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for type:", userType);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        let profileData;
        if (userType === 'client') {
          const { data, error } = await supabase
            .from('clients')
            .select('first_name, last_name, email, phone, address')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching client profile:', error);
            return;
          }
          
          profileData = data;
          console.log("Client profile data:", profileData);
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