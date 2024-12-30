import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";

export function useProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
    setUserType(session?.user?.user_metadata?.user_type || null);
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userType = session.user.user_metadata?.user_type;
        const table = userType === 'carrier' ? 'carriers' : 'clients';
        
        const query = supabase
          .from(table)
          .select(userType === 'carrier' ? `
            *,
            carrier_capacities (
              total_capacity,
              price_per_kg,
              offers_home_delivery
            ),
            carrier_services (
              service_type,
              icon
            )
          ` : '*')
          .eq('id', session.user.id);

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger votre profil",
          });
          return;
        }

        if (!data) {
          toast({
            variant: "destructive",
            title: "Profil non trouvé",
            description: "Votre profil n'a pas été trouvé",
          });
          return;
        }

        const profileData: ProfileData = {
          ...data,
          email: session.user.email,
        };

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