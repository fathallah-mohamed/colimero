import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TourFormHeader } from "./form/TourFormHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tourFormSchema } from "./form/tourFormSchema";
import { useState } from "react";
import { TourConfirmDialog } from "./form/TourConfirmDialog";
import { TourSuccessDialog } from "./form/TourSuccessDialog";
import { TourSubmitButton } from "./form/TourSubmitButton";
import { RouteSection } from "./form/sections/RouteSection";
import { CapacitySection } from "./form/sections/CapacitySection";
import { TermsSection } from "./form/sections/TermsSection";
import { CollectionPointsSection } from "./form/sections/CollectionPointsSection";
import { TourTypeSection } from "./form/sections/TourTypeSection";
import type { TourFormValues } from "./form/types";
import * as z from "zod";

interface CreateTourFormProps {
  onSuccess: () => void;
}

export default function CreateTourForm({ onSuccess }: CreateTourFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<TourFormValues>({
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
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof tourFormSchema>) {
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

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const tourNumber = `TRN-${values.departure_country}${values.destination_country}-${timestamp}-${Math.random().toString(36).substring(2, 10)}`;

      const { data, error } = await supabase.from("tours").insert({
        carrier_id: user.id,
        departure_country: values.departure_country,
        destination_country: values.destination_country,
        departure_date: values.departure_date.toISOString(),
        collection_date: new Date(values.route[0].collection_date).toISOString(),
        total_capacity: values.total_capacity,
        remaining_capacity: values.remaining_capacity,
        type: values.type,
        route: values.route,
        status: "Programmée",
        terms_accepted: values.terms_accepted,
        customs_declaration: values.customs_declaration,
        tour_number: tourNumber
      }).select();

      if (error) throw error;

      console.log("Tour created successfully:", data);
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

  const isFormValid = form.formState.isValid && form.watch('terms_accepted') && form.watch('customs_declaration');

  return (
    <>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => setShowConfirmDialog(true))} className="space-y-6">
              <TourFormHeader />
              <RouteSection form={form} />
              <TourTypeSection form={form} />
              <CapacitySection form={form} />
              <CollectionPointsSection form={form} />
              <TermsSection form={form} />
              <TourSubmitButton 
                isSubmitting={isSubmitting}
                isValid={isFormValid}
              />
            </form>
          </Form>
        </div>
      </ScrollArea>

      <TourConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => onSubmit(form.getValues())}
      />

      <TourSuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
}