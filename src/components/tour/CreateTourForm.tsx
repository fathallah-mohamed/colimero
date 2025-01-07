import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TourFormHeader } from "./form/TourFormHeader";
import { TourFormSections } from "./form/TourFormSections";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tourFormSchema } from "./form/tourFormSchema";
import { Truck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FormValues = z.infer<typeof tourFormSchema>;

interface CreateTourFormProps {
  onSuccess: () => void;
}

export default function CreateTourForm({ onSuccess }: CreateTourFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmChecks, setConfirmChecks] = useState({
    info_accuracy: false,
    transport_responsibility: false,
    platform_rules: false,
    safety_confirmation: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      departure_country: "FR",
      destination_country: "TN",
      total_capacity: 1000,
      remaining_capacity: 1000,
      type: "public",
      departure_date: new Date(),
      terms_accepted: false,
      customs_declaration: false,
      route: [
        {
          name: "",
          location: "",
          time: "",
          type: "pickup",
          collection_date: new Date().toISOString().split('T')[0],
        },
      ],
    },
  });

  const handleConfirmSubmit = async () => {
    if (Object.values(confirmChecks).every(check => check)) {
      await onSubmit(form.getValues());
      setShowConfirmDialog(false);
    }
  };

  const handleInitialSubmit = () => {
    if (form.formState.isValid) {
      setShowConfirmDialog(true);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour créer une tournée",
        });
        return;
      }

      const hasInvalidDates = values.route.some(point => {
        const collectionDate = new Date(point.collection_date);
        return collectionDate > values.departure_date;
      });

      if (hasInvalidDates) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Les dates de collecte doivent être antérieures à la date de départ",
        });
        return;
      }

      const { error } = await supabase.from("tours").insert({
        carrier_id: user.id,
        departure_country: values.departure_country,
        destination_country: values.destination_country,
        departure_date: values.departure_date.toISOString(),
        collection_date: new Date(values.route[0].collection_date).toISOString(),
        total_capacity: values.total_capacity,
        remaining_capacity: values.remaining_capacity,
        type: values.type,
        route: values.route,
        terms_accepted: values.terms_accepted,
        customs_declaration: values.customs_declaration,
        status: "Programmé",
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La tournée a été créée avec succès",
        className: "bg-green-50 border-green-200",
      });
      
      onSuccess();
      navigate("/transporteur/tournees");
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tournée",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="space-y-6">
              <TourFormHeader />
              <TourFormSections form={form} />
              
              <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 h-4 w-4" />
                      Créer la tournée
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de création de la tournée</DialogTitle>
            <DialogDescription>
              Veuillez confirmer les points suivants avant de créer la tournée
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="info_accuracy"
                checked={confirmChecks.info_accuracy}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, info_accuracy: checked as boolean }))
                }
              />
              <Label htmlFor="info_accuracy" className="text-sm leading-none">
                Je certifie que toutes les informations saisies pour cette tournée sont exactes et conformes à la réalité.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="transport_responsibility"
                checked={confirmChecks.transport_responsibility}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, transport_responsibility: checked as boolean }))
                }
              />
              <Label htmlFor="transport_responsibility" className="text-sm leading-none">
                Je reconnais être seul(e) responsable des objets transportés dans cette tournée, et je m'engage à respecter toutes les lois et réglementations applicables au transport de marchandises.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="platform_rules"
                checked={confirmChecks.platform_rules}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, platform_rules: checked as boolean }))
                }
              />
              <Label htmlFor="platform_rules" className="text-sm leading-none">
                J'ai lu et j'accepte les <a href="/cgu" className="text-primary hover:underline" target="_blank">Conditions Générales d'Utilisation (CGU)</a> ainsi que les règles de fonctionnement de la plateforme Colimero.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="safety_confirmation"
                checked={confirmChecks.safety_confirmation}
                onCheckedChange={(checked) => 
                  setConfirmChecks(prev => ({ ...prev, safety_confirmation: checked as boolean }))
                }
              />
              <Label htmlFor="safety_confirmation" className="text-sm leading-none">
                Je comprends que je suis seul(e) responsable de la sécurité, du bon état et de la conformité des colis que je transporte dans cette tournée.
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={!Object.values(confirmChecks).every(check => check)}
            >
              Confirmer la création
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}