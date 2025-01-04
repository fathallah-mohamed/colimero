import { supabase } from "@/integrations/supabase/client";

export async function fetchCarrierProfile(userId: string, userEmail: string | undefined) {
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
    .eq('id', userId)
    .single();

  if (carrierError) throw carrierError;
  
  if (carrierData) {
    return {
      id: carrierData.id,
      first_name: carrierData.first_name,
      last_name: carrierData.last_name,
      phone: carrierData.phone,
      email: userEmail,
      company_name: carrierData.company_name,
      siret: carrierData.siret,
      address: carrierData.address,
      coverage_area: carrierData.coverage_area,
      created_at: carrierData.created_at,
      carrier_capacities: carrierData.carrier_capacities,
      carrier_services: carrierData.carrier_services
    };
  }

  return null;
}