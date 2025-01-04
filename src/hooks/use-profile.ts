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
      
      const currentUserType = session.user.user_metadata.user_type;
      if (!currentUserType) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { user_type: 'admin' }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          throw updateError;
        }
      }
      
      setUserType(currentUserType || 'admin');
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
          profileData = await createAdminProfile(session.user.id, session.user.email, session.user.user_metadata);
        }
      } else if (userType === 'carrier') {
        profileData = await fetchCarrierProfile(session.user.id, session.user.email);
      } else {
        profileData = await fetchClientProfile(session.user.id, session.user.email);
      }

      if (profileData) {
        console.log('Profile data loaded:', profileData);
        setProfile(profileData);
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