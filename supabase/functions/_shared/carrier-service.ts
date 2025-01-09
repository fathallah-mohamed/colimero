import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CarrierRequest } from "./types.ts";

export async function createCarrierProfile(
  supabaseClient: ReturnType<typeof createClient>,
  request: CarrierRequest,
  userId: string
) {
  // Insert carrier record
  const { error: carrierError } = await supabaseClient
    .from('carriers')
    .insert({
      id: userId,
      email: request.email,
      first_name: request.first_name,
      last_name: request.last_name,
      phone: request.phone,
      phone_secondary: request.phone_secondary,
      company_name: request.company_name,
      siret: request.siret,
      address: request.address,
      coverage_area: request.coverage_area,
      avatar_url: request.avatar_url,
      email_verified: true,
      company_details: request.company_details,
      authorized_routes: request.authorized_routes,
      total_deliveries: request.total_deliveries || 0,
      cities_covered: request.cities_covered || 30,
      status: 'active'
    });

  if (carrierError) throw carrierError;

  // Insert carrier capacities
  const { error: capacitiesError } = await supabaseClient
    .from('carrier_capacities')
    .insert({
      carrier_id: userId,
      total_capacity: request.total_capacity || 1000,
      price_per_kg: request.price_per_kg || 12
    });

  if (capacitiesError) throw capacitiesError;

  // Insert carrier services
  if (request.services && request.services.length > 0) {
    const { error: servicesError } = await supabaseClient
      .from('carrier_services')
      .insert(
        request.services.map(service => ({
          carrier_id: userId,
          service_type: service,
          icon: 'package'
        }))
      );

    if (servicesError) throw servicesError;
  }
}