import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormSection } from "./FormSection";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RouteInformationProps {
  form: UseFormReturn<any>;
}

export function RouteInformation({ form }: RouteInformationProps) {
  const [authorizedRoutes, setAuthorizedRoutes] = useState<string[]>([]);

  useEffect(() => {
    const fetchCarrierProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: carrierData } = await supabase
          .from('carriers')
          .select('coverage_area')
          .eq('id', session.user.id)
          .single();

        if (carrierData?.coverage_area) {
          setAuthorizedRoutes(carrierData.coverage_area);
        }
      }
    };

    fetchCarrierProfile();
  }, []);

  return (
    <FormSection title="Informations de trajet">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="departure_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de départ</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                onOpenChange={(open) => {
                  if (open && authorizedRoutes.length === 2) {
                    field.onChange(authorizedRoutes[0]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {authorizedRoutes.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country === 'FR' ? 'France' : 
                       country === 'TN' ? 'Tunisie' :
                       country === 'MA' ? 'Maroc' :
                       country === 'DZ' ? 'Algérie' : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de destination</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                onOpenChange={(open) => {
                  if (open && authorizedRoutes.length === 2) {
                    const departure = form.getValues('departure_country');
                    field.onChange(authorizedRoutes.find(c => c !== departure) || authorizedRoutes[1]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {authorizedRoutes
                    .filter(country => country !== form.getValues('departure_country'))
                    .map((country) => (
                      <SelectItem key={country} value={country}>
                        {country === 'FR' ? 'France' : 
                         country === 'TN' ? 'Tunisie' :
                         country === 'MA' ? 'Maroc' :
                         country === 'DZ' ? 'Algérie' : country}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}