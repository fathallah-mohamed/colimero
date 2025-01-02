import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ServicesSectionProps {
  profile: any;
  onUpdate: () => void;
}

export function ServicesSection({ profile, onUpdate }: ServicesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
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
      
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Services proposés</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Settings className="h-4 w-4" />
            Modifier
          </Button>
        </div>
        <div className="space-y-4">
          {profile.carrier_services?.map((service: any) => (
            <div key={service.service_type} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                {service.icon && (
                  <img
                    src={`/icons/${service.icon}.svg`}
                    alt={service.service_type}
                    className="h-5 w-5"
                  />
                )}
              </div>
              <span className="text-gray-700">
                {
                  {
                    'livraison_express': 'Livraison Express',
                    'livraison_domicile': 'Livraison à domicile',
                    'transport_standard': 'Transport de colis standard',
                    'transport_volumineux': 'Transport d\'objets volumineux',
                    'collecte_programmee': 'Collecte programmée'
                  }[service.service_type] || service.service_type
                }
              </span>
            </div>
          ))}
          {(!profile.carrier_services || profile.carrier_services.length === 0) && (
            <p className="text-gray-500 text-center py-4">
              Aucun service sélectionné
            </p>
          )}
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary">
              Modifier mes services
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ServiceOptions form={form} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}