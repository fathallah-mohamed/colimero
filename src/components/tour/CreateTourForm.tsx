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

type FormValues = z.infer<typeof tourFormSchema>;

export default function CreateTourForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  async function onSubmit(values: FormValues) {
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
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La tournée a été créée avec succès",
      });
      navigate("/transporteur/tournees");
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tournée",
      });
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TourFormHeader />
            <TourFormSections form={form} />
            <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={!form.getValues("terms_accepted") || !form.getValues("customs_declaration")}
              >
                Créer la tournée
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}