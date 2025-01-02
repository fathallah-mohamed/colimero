import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { CompanyInfoFields } from "./form/CompanyInfoFields";
import { ContactInfoFields } from "./form/ContactInfoFields";
import { CoverageAreaFields } from "./form/CoverageAreaFields";
import { CapacityFields } from "./form/CapacityFields";
import { ServicesFields } from "./form/ServicesFields";
import { formSchema, type FormValues } from "./form/formSchema";

interface ProfileFormProps {
  initialData: any;
  onClose: () => void;
}

export function ProfileForm({ initialData, onClose }: ProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
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
    },
  });

  async function onSubmit(values: FormValues) {
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
          phone_secondary: values.phone_secondary,
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

      const { error: deleteError } = await supabase
        .from('carrier_services')
        .delete()
        .eq('carrier_id', session.user.id);

      if (deleteError) throw deleteError;

      const servicesToInsert = values.services.map(serviceType => ({
        carrier_id: session.user.id,
        service_type: serviceType,
        icon: serviceOptions.find(opt => opt.id === serviceType)?.icon || 'package'
      }));

      const { error: servicesError } = await supabase
        .from('carrier_services')
        .insert(servicesToInsert);

      if (servicesError) throw servicesError;

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
        <ContactInfoFields form={form} />
        <CoverageAreaFields form={form} />
        <CapacityFields form={form} />
        <ServicesFields form={form} />

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