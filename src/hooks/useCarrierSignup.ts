import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const useCarrierSignup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (formData: any) => {
    setIsLoading(true);
    try {
      const carrierId = uuidv4();
      
      const { error } = await supabase
        .from('carriers')
        .insert({
          id: carrierId,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          siret: formData.siret,
          phone: formData.phone,
          phone_secondary: formData.phone_secondary || '',
          address: formData.address,
          coverage_area: formData.coverage_area,
          avatar_url: formData.avatar_url || '',
          company_details: formData.company_details || {},
          authorized_routes: ['FR_TO_TN', 'TN_TO_FR'],
          status: 'pending',
          password: formData.password
        });

      if (error) throw error;

      // Create carrier capacity
      await supabase
        .from('carrier_capacities')
        .insert({
          carrier_id: carrierId,
          total_capacity: 1000,
          price_per_kg: 12
        });

      // Create carrier services
      if (formData.services?.length > 0) {
        const serviceInserts = formData.services.map((service: string) => ({
          carrier_id: carrierId,
          service_type: service,
          icon: 'package'
        }));

        await supabase
          .from('carrier_services')
          .insert(serviceInserts);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in carrier signup:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};