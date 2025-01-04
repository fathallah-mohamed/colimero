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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
        return;
      }
      
      // Ensure user_type is set in metadata
      if (!session.user.user_metadata.user_type) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { user_type: 'admin' }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          throw updateError;
        }
      }
      
      setUserType(session.user.user_metadata.user_type || null);
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

      const userType = session.user.user_metadata?.user_type;
      console.log("Fetching profile for user type:", userType);
      
      if (userType === 'admin') {
        // Try to fetch existing admin profile
        const { data: adminData, error: adminError } = await supabase
          .from('administrators')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error fetching admin profile:', adminError);
          throw adminError;
        }
        
        if (adminData) {
          const profileData: ProfileData = {
            id: adminData.id,
            first_name: adminData.first_name || '',
            last_name: adminData.last_name || '',
            phone: adminData.phone || '',
            email: session.user.email || '',
            address: adminData.address || '',
            created_at: adminData.created_at
          };
          console.log("Admin profile data:", profileData);
          setProfile(profileData);
        } else {
          // Create new admin profile if none exists
          const { data: newAdminData, error: insertError } = await supabase
            .from('administrators')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || '',
                address: 'À renseigner'
              }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating admin profile:', insertError);
            throw insertError;
          }

          if (newAdminData) {
            const profileData: ProfileData = {
              id: newAdminData.id,
              first_name: newAdminData.first_name || '',
              last_name: newAdminData.last_name || '',
              phone: newAdminData.phone || '',
              email: session.user.email || '',
              address: newAdminData.address || '',
              created_at: newAdminData.created_at
            };
            console.log("New admin profile data:", profileData);
            setProfile(profileData);
          }
        }
      } else if (userType === 'carrier') {
        const { data: carrierData, error: carrierError } = await supabase
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

        if (carrierError) throw carrierError;
        
        if (carrierData) {
          const profileData: ProfileData = {
            id: carrierData.id,
            first_name: carrierData.first_name,
            last_name: carrierData.last_name,
            phone: carrierData.phone,
            email: session.user.email,
            company_name: carrierData.company_name,
            siret: carrierData.siret,
            address: carrierData.address,
            coverage_area: carrierData.coverage_area,
            created_at: carrierData.created_at,
            carrier_capacities: carrierData.carrier_capacities,
            carrier_services: carrierData.carrier_services
          };
          console.log("Carrier profile data:", profileData);
          setProfile(profileData);
        }
      } else {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (clientError) throw clientError;
        
        if (clientData) {
          const profileData: ProfileData = {
            id: clientData.id,
            first_name: clientData.first_name,
            last_name: clientData.last_name,
            phone: clientData.phone,
            email: session.user.email,
            created_at: clientData.created_at,
            birth_date: clientData.birth_date,
            address: clientData.address,
            id_document: clientData.id_document
          };
          console.log("Client profile data:", profileData);
          setProfile(profileData);
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