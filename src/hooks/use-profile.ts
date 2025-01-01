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
        
        let query;
        if (userType === 'carrier') {
          const { data, error } = await supabase
            .from('carriers')
            .select(`
              id,
              first_name,
              last_name,
              phone,
              email,
              company_name,
              siret,
              address,
              coverage_area,
              created_at,
              carrier_capacities!carrier_capacities_carrier_id_fkey (
                total_capacity,
                price_per_kg,
                offers_home_delivery
              ),
              carrier_services!carrier_services_carrier_id_fkey (
                service_type,
                icon
              )
            `)
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          if (data) {
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
              created_at: data.created_at,
              carrier_capacities: data.carrier_capacities,
              carrier_services: data.carrier_services
            };
            setProfile(profileData);
          }
        } else {
          const { data, error } = await supabase
            .from('clients')
            .select('id, first_name, last_name, phone, created_at')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          if (data) {
            const profileData: ProfileData = {
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              phone: data.phone,
              email: session.user.email,
              created_at: data.created_at
            };
            setProfile(profileData);
          }
        }
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