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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceOptions } from "./ServiceOptions";
import { CoverageAreaSelect } from "./CoverageAreaSelect";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  companyName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().length(14, "Le numéro SIRET doit contenir 14 chiffres"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phoneSecondary: z.string().optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  totalCapacity: z.number().min(1, "La capacité totale doit être supérieure à 0"),
  pricePerKg: z.number().min(0, "Le prix par kg doit être positif"),
  coverageArea: z.array(z.string()).min(1, "Sélectionnez au moins un pays"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
});

export default function CarrierSignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCapacity: 1000,
      pricePerKg: 12,
      coverageArea: ["FR", "TN"],
      services: [],
      phoneSecondary: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('carrier_registration_requests')
        .insert({
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          company_name: values.companyName,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phoneSecondary,
          address: values.address,
          coverage_area: values.coverageArea,
          total_capacity: values.totalCapacity,
          price_per_kg: values.pricePerKg,
          services: values.services,
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée avec succès",
        description: "Votre demande d'inscription a été envoyée pour validation. Vous serez informé par email une fois votre compte activé.",
      });
      
      onSuccess();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
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
            name="lastName"
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
            name="companyName"
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
            name="phoneSecondary"
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
            name="totalCapacity"
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
            name="pricePerKg"
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
        </div>

        <CoverageAreaSelect form={form} />
        <ServiceOptions form={form} />

        <Button type="submit" className="w-full">
          Envoyer ma demande d'inscription
        </Button>
      </form>
    </Form>
  );
}