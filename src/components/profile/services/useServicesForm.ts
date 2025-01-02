import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useServicesForm(profile: any, onUpdate: () => void) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      services: profile.carrier_services?.map((s: any) => s.service_type) || [],
    },
  });

  const onSubmit = async (values: { services: string[] }) => {
    try {
      const currentServices = profile.carrier_services?.map((s: any) => s.service_type) || [];
      const newServices = values.services;

      // Services à supprimer (présents dans currentServices mais pas dans newServices)
      const servicesToRemove = currentServices.filter(s => !newServices.includes(s));
      
      // Services à ajouter (présents dans newServices mais pas dans currentServices)
      const servicesToAdd = newServices.filter(s => !currentServices.includes(s));

      // Supprimer les services qui ne sont plus sélectionnés
      if (servicesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('carrier_services')
          .delete()
          .eq('carrier_id', profile.id)
          .in('service_type', servicesToRemove);

        if (deleteError) throw deleteError;
      }

      // Ajouter les nouveaux services sélectionnés
      if (servicesToAdd.length > 0) {
        const servicesToInsert = servicesToAdd.map(serviceType => ({
          carrier_id: profile.id,
          service_type: serviceType,
          icon: {
            'livraison_express': 'truck',
            'livraison_domicile': 'home',
            'transport_standard': 'package',
            'transport_volumineux': 'sofa',
            'collecte_programmee': 'calendar'
          }[serviceType] || 'package'
        }));

        const { error: insertError } = await supabase
          .from('carrier_services')
          .insert(servicesToInsert);

        if (insertError) throw insertError;
      }

      toast({
        title: "Succès",
        description: "Services mis à jour avec succès",
      });
      
      onUpdate();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
      return false;
    }
  };

  return { form, onSubmit };
}