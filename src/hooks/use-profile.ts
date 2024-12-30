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
            id,
            first_name,
            last_name,
            phone,
            company_name,
            siret,
            address,
            coverage_area,
            carrier_capacities (
              total_capacity,
              price_per_kg,
              offers_home_delivery
            ),
            carrier_services (
              service_type,
              icon
            )
          ` : 'id, first_name, last_name, phone')
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

        // Create a new object with the profile data and email
        const profileData: ProfileData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: session.user.email,
          company_name: data.company_name,
          siret: data.siret,
          address: data.address,
          coverage_area: data.coverage_area,
          carrier_capacities: data.carrier_capacities,
          carrier_services: data.carrier_services
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