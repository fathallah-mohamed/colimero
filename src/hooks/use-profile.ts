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
      console.log("User email from session:", session.user.email);
      
      let profileData = null;

      if (userType === 'admin') {
        profileData = await fetchAdminProfile(session.user.id, session.user.email);
        
        if (!profileData) {
          console.log('No admin profile found, creating one...');
          const metadata = {
            first_name: session.user.user_metadata?.first_name || 'Admin',
            last_name: session.user.user_metadata?.last_name || 'User',
            address: session.user.user_metadata?.address || 'À renseigner',
            phone: session.user.user_metadata?.phone || '',
            email: session.user.email
          };
          profileData = await createAdminProfile(session.user.id, session.user.email, metadata);
        }
      } else if (userType === 'carrier') {
        profileData = await fetchCarrierProfile(session.user.id, session.user.email);
      } else {
        // Utilisation de maybeSingle() au lieu de single() pour les clients
        const { data: clientData, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching client profile:', error);
          throw error;
        }

        if (!clientData) {
          console.log('No client profile found');
          toast({
            variant: "destructive",
            title: "Profil introuvable",
            description: "Impossible de trouver votre profil client",
          });
        } else {
          profileData = clientData;
        }
      }

      if (profileData) {
        console.log('Profile data loaded:', profileData);
        // Assurez-vous que l'email est défini
        if (!profileData.email && session.user.email) {
          profileData.email = session.user.email;
        }
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