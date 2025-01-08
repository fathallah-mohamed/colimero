import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TourFormHeader } from "./form/TourFormHeader";
import { TourFormSections } from "./form/TourFormSections";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tourFormSchema } from "./form/tourFormSchema";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { TourConfirmDialog } from "./form/TourConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import * as z from "zod";

type FormValues = z.infer<typeof tourFormSchema>;

interface CreateTourFormProps {
  onSuccess: () => void;
}

export default function CreateTourForm({ onSuccess }: CreateTourFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      departure_country: "FR",
      destination_country: "TN",
      total_capacity: 1000,
      remaining_capacity: 1000,
      type: "public",
      departure_date: new Date(),
      route: [
        {
          name: "",
          location: "",
          time: "",
          type: "pickup",
          collection_date: new Date().toISOString().split('T')[0],
        },
      ],
      terms_accepted: false,
      customs_declaration: false,
    },
  });

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
        status: "Programmé",
        terms_accepted: values.terms_accepted,
        customs_declaration: values.customs_declaration,
      });

      if (error) throw error;

      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tournée",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  }

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    onSuccess();
    navigate("/transporteur/tournees");
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => setShowConfirmDialog(true))} className="space-y-6">
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

      <TourConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => onSubmit(form.getValues())}
      />

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Tournée créée avec succès
            </DialogTitle>
            <DialogDescription>
              Votre tournée a été créée avec succès. Vous pouvez maintenant la consulter dans votre liste de tournées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={handleSuccessConfirm}
              className="w-full"
            >
              J'ai compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}