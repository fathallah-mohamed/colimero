import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TourFormHeader } from "./form/TourFormHeader";
import { RouteInformation } from "./form/RouteInformation";
import { CapacityInformation } from "./form/CapacityInformation";
import { CollectionPointForm } from "./CollectionPointForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  departure_country: z.string(),
  destination_country: z.string(),
  total_capacity: z.number().min(1),
  remaining_capacity: z.number().min(0),
  type: z.enum(["public", "private"]),
  departure_date: z.date(),
  route: z.array(
    z.object({
      name: z.string().min(1, "La ville est requise"),
      location: z.string().min(1, "L'adresse est requise"),
      collection_date: z.string().min(1, "La date de collecte est requise"),
      time: z.string().min(1, "L'heure est requise"),
      type: z.literal("pickup")
    })
  ).min(1, "Au moins un point de collecte est requis"),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
  customs_declaration: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la déclaration douanière",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTourForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route",
  });

  const departureDate = form.watch('departure_date');

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

      const routeWithDates = values.route.map(point => ({
        name: point.name,
        location: point.location,
        collection_date: new Date(point.collection_date).toISOString(),
        time: point.time,
        type: point.type,
      }));

      const { error } = await supabase.from("tours").insert({
        carrier_id: user.id,
        departure_country: values.departure_country,
        destination_country: values.destination_country,
        departure_date: values.departure_date.toISOString(),
        collection_date: new Date(values.route[0].collection_date).toISOString(),
        total_capacity: values.total_capacity,
        remaining_capacity: values.remaining_capacity,
        type: values.type,
        route: routeWithDates,
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
    <ScrollArea className="h-[calc(100vh-4rem)] px-4">
      <div className="max-w-3xl mx-auto py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TourFormHeader />
            
            <div className="space-y-6">
              <RouteInformation form={form} />
              <CapacityInformation form={form} />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Points de collecte</h2>
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        name: "",
                        location: "",
                        time: "",
                        type: "pickup",
                        collection_date: new Date().toISOString().split('T')[0],
                      })
                    }
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un point
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <CollectionPointForm
                      key={field.id}
                      index={index}
                      onRemove={remove}
                      form={form}
                      departureDate={departureDate}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold">Déclarations</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customs_declaration"
                    render={({ field }) => (
                      <div className="flex items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="space-y-1 leading-none">
                          <label className="text-sm font-medium leading-none">
                            Je déclare que je respecterai toutes les lois douanières et réglementations applicables
                          </label>
                          <p className="text-sm text-gray-500">
                            Je suis responsable des objets que je transporte
                          </p>
                        </div>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms_accepted"
                    render={({ field }) => (
                      <div className="flex items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="space-y-1 leading-none">
                          <label className="text-sm font-medium leading-none">
                            J'accepte les conditions générales d'utilisation
                          </label>
                          <p className="text-sm text-gray-500">
                            Je comprends que je suis responsable du respect des lois applicables
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t mt-8 -mx-4">
              <Button 
                type="submit" 
                className="w-full"
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