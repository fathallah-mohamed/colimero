import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { CompanyInfoFields } from "./form/CompanyInfoFields";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { CapacityFields } from "@/components/auth/carrier-signup/CapacityFields";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  phone_secondary: z.string().optional(),
  company_name: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  siret: z.string().min(14, "Le numéro SIRET doit contenir 14 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  total_capacity: z.number().min(0),
  price_per_kg: z.number().min(0),
});

interface ProfileFormProps {
  initialData: any;
  onClose: () => void;
}

export function ProfileForm({ initialData, onClose }: ProfileFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      phone: initialData.phone || "",
      phone_secondary: initialData.phone_secondary || "",
      company_name: initialData.company_name || "",
      siret: initialData.siret || "",
      address: initialData.address || "",
      services: initialData.carrier_services?.map((s: any) => s.service_type) || [],
      total_capacity: initialData.carrier_capacities?.total_capacity || 0,
      price_per_kg: initialData.carrier_capacities?.price_per_kg || 0,
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

      // Update carrier profile
      const { error: carrierError } = await supabase
        .from('carriers')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          phone_secondary: values.phone_secondary,
          company_name: values.company_name,
          siret: values.siret,
          address: values.address,
        })
        .eq('id', session.user.id);

      if (carrierError) throw carrierError;

      // Update carrier capacities
      const { error: capacitiesError } = await supabase
        .from('carrier_capacities')
        .upsert({
          carrier_id: session.user.id,
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
        });

      if (capacitiesError) throw capacitiesError;

      // Delete existing services
      const { error: deleteServicesError } = await supabase
        .from('carrier_services')
        .delete()
        .eq('carrier_id', session.user.id);

      if (deleteServicesError) throw deleteServicesError;

      // Insert new services
      if (values.services.length > 0) {
        const { error: servicesError } = await supabase
          .from('carrier_services')
          .insert(
            values.services.map(service => ({
              carrier_id: session.user.id,
              service_type: service,
              icon: {
                'livraison_express': 'truck',
                'livraison_domicile': 'home',
                'transport_standard': 'package',
                'transport_volumineux': 'sofa',
                'collecte_programmee': 'calendar'
              }[service] || 'package'
            }))
          );

        if (servicesError) throw servicesError;
      }

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
        <PersonalInfoFields form={form} />
        <CompanyInfoFields form={form} />
        <ServiceOptions form={form} />
        <CapacityFields form={form} />

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