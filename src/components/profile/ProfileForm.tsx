import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company_name: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().length(14, "Le numéro SIRET doit contenir 14 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phone_secondary: z.string().optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins un pays"),
  total_capacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  price_per_kg: z.number().min(0, "Le prix par kg doit être positif"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  email: z.string().email("Email invalide"),
});

interface ProfileFormProps {
  initialData: any;
  onClose: () => void;
}

export function ProfileForm({ initialData, onClose }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      company_name: initialData.company_name || "",
      siret: initialData.siret || "",
      phone: initialData.phone || "",
      phone_secondary: initialData.phone_secondary || "",
      address: initialData.address || "",
      coverage_area: initialData.coverage_area || ["FR", "TN"],
      total_capacity: initialData.carrier_capacities?.total_capacity || 1000,
      price_per_kg: initialData.carrier_capacities?.price_per_kg || 12,
      services: initialData.carrier_services?.map((s: any) => s.service_type) || [],
      email: initialData.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Update email in auth.users
      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email: values.email,
      });

      if (emailUpdateError) throw emailUpdateError;

      // Update carrier profile
      const { error: carrierError } = await supabase
        .from('carriers')
        .update({
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phone_secondary,
          address: values.address,
          coverage_area: values.coverage_area,
        })
        .eq('id', initialData.id);

      if (carrierError) throw carrierError;

      const { error: capacityError } = await supabase
        .from('carrier_capacities')
        .update({
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
        })
        .eq('carrier_id', initialData.id);

      if (capacityError) throw capacityError;

      // Supprimer les services existants
      const { error: deleteError } = await supabase
        .from('carrier_services')
        .delete()
        .eq('carrier_id', initialData.id);

      if (deleteError) throw deleteError;

      // Insérer les nouveaux services
      const servicesToInsert = values.services.map(serviceType => ({
        carrier_id: initialData.id,
        service_type: serviceType,
        icon: serviceOptions.find(opt => opt.id === serviceType)?.icon || 'package'
      }));

      const { error: servicesError } = await supabase
        .from('carrier_services')
        .insert(servicesToInsert);

      if (servicesError) throw servicesError;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès. Veuillez vérifier votre email pour confirmer le changement.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'entreprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIRET</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone principal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_secondary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone secondaire (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverage_area"
          render={() => (
            <FormItem>
              <FormLabel>Zones de couverture</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {countryOptions.map((country) => (
                  <FormField
                    key={country.id}
                    control={form.control}
                    name="coverage_area"
                    render={({ field }) => (
                      <FormItem
                        key={country.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(country.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, country.id]
                                : field.value?.filter((value) => value !== country.id);
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {country.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité totale (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_per_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par kg (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem className="col-span-2">
              <FormLabel>Services proposés</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {serviceOptions.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem
                        key={service.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, service.id]
                                : field.value?.filter((value) => value !== service.id);
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {service.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}
