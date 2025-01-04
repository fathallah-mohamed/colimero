import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";
import { fetchAdminProfile, createAdminProfile } from "./profile/use-admin-profile";
import { fetchCarrierProfile } from "./profile/use-carrier-profile";
import { fetchClientProfile } from "./profile/use-client-profile";

export function useProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
        return;
      }
      
      const currentUserType = session.user.user_metadata?.user_type;
      if (!currentUserType) {
        console.log('No user type found, setting default to admin');
        const { error: updateError } = await supabase.auth.updateUser({
          data: { user_type: 'admin' }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          throw updateError;
        }

        setUserType('admin');
      } else {
        setUserType(currentUserType);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/connexion');
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userType = session.user.user_metadata?.user_type || 'admin';
      console.log("Fetching profile for user type:", userType);
      
      let profileData = null;

      if (userType === 'admin') {
        profileData = await fetchAdminProfile(session.user.id, session.user.email);
        
        if (!profileData) {
          console.log('No admin profile found, creating one...');
          const metadata = {
            first_name: session.user.user_metadata?.first_name || 'Admin',
            last_name: session.user.user_metadata?.last_name || 'User',
            address: session.user.user_metadata?.address || 'À renseigner',
            phone: session.user.user_metadata?.phone || ''
          };
          profileData = await createAdminProfile(session.user.id, session.user.email, metadata);
        }
      } else if (userType === 'carrier') {
        profileData = await fetchCarrierProfile(session.user.id, session.user.email);
      } else {
        profileData = await fetchClientProfile(session.user.id, session.user.email);
      }

      if (profileData) {
        console.log('Profile data loaded:', profileData);
        setProfile(profileData);
      } else {
        console.log('No profile data found');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
    fetchProfile();
  }, []);

  return { profile, loading, userType, fetchProfile };
}