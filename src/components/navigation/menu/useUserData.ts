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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let profileData;
      if (userType === 'admin') {
        const { data } = await supabase
          .from('administrators')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .maybeSingle();
        profileData = data;
      } else if (userType === 'carrier') {
        const { data } = await supabase
          .from('carriers')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .maybeSingle();
        profileData = data;
      } else {
        const { data } = await supabase
          .from('clients')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .maybeSingle();
        profileData = data;
      }

      if (profileData) {
        setUserData(profileData);
      }
    };

    fetchUserData();
  }, [userType]);

  return userData;
}