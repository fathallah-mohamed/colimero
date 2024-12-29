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

const countryOptions = [
  { id: "FR", label: "France" },
  { id: "TN", label: "Tunisie" },
  { id: "MA", label: "Maroc" },
  { id: "DZ", label: "Algérie" },
];

const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  company_name: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().length(14, "Le numéro SIRET doit contenir 14 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  coverage_area: z.array(z.string()).min(1, "Sélectionnez au moins un pays"),
  total_capacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  price_per_kg: z.number().min(0, "Le prix par kg doit être positif"),
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
      address: initialData.address || "",
      coverage_area: initialData.coverage_area || ["FR", "TN"],
      total_capacity: initialData.carrier_capacities?.total_capacity || 1000,
      price_per_kg: initialData.carrier_capacities?.price_per_kg || 12,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour modifier votre profil",
        });
        return;
      }

      const { error: carrierError } = await supabase
        .from('carriers')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret,
          phone: values.phone,
          address: values.address,
          coverage_area: values.coverage_area,
        })
        .eq('id', session.user.id);

      if (carrierError) throw carrierError;

      const { error: capacityError } = await supabase
        .from('carrier_capacities')
        .update({
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
        })
        .eq('carrier_id', session.user.id);

      if (capacityError) throw capacityError;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
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
        <div className="grid grid-cols-2 gap-4">
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
        </div>

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
              <FormLabel>Téléphone</FormLabel>
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