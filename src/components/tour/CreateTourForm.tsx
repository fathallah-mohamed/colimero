import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollectionPointForm } from "./CollectionPointForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  departure_country: z.string(),
  destination_country: z.string(),
  departure_date: z.date(),
  total_capacity: z.number().min(1),
  remaining_capacity: z.number().min(0),
  type: z.enum(["public", "private"]),
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

export default function CreateTourForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEngagementsDialog, setShowEngagementsDialog] = useState(false);
  const [hasAcceptedEngagements, setHasAcceptedEngagements] = useState(false);

  const { data: userConsents, isLoading: isLoadingConsents } = useQuery({
    queryKey: ["userConsents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const allAccepted = userConsents?.every(consent => consent.accepted) ?? false;
    setHasAcceptedEngagements(allAccepted);
    if (!allAccepted) {
      setShowEngagementsDialog(true);
    }
  }, [userConsents]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure_country: "FR",
      destination_country: "TN",
      total_capacity: 1000,
      remaining_capacity: 1000,
      type: "public",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour créer une tournée",
        });
        return;
      }

      // Vérifier que toutes les dates de collecte sont antérieures à la date de départ
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
        collection_date: new Date(values.route[0].collection_date).toISOString(), // Utiliser la première date de collecte comme date de référence
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

  if (!hasAcceptedEngagements) {
    return (
      <Dialog open={showEngagementsDialog} onOpenChange={setShowEngagementsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Engagements requis</DialogTitle>
            <DialogDescription>
              Pour créer une tournée, vous devez d'abord accepter tous les engagements dans votre profil.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate('/profil')}>
              Aller à mon profil
            </Button>
            <Button onClick={() => setShowEngagementsDialog(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="departure_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays de départ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="TN">Tunisie</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays de destination</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="TN">Tunisie</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departure_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de départ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_capacity"
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
            name="remaining_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité disponible (kg)</FormLabel>
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de tournée</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Publique</SelectItem>
                    <SelectItem value="private">Privée</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Points de collecte</h2>
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un point
            </Button>
          </div>

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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="customs_declaration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Je déclare que je respecterai toutes les lois douanières et réglementations applicables, et que je suis responsable des objets que je transporte.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms_accepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    J'accepte les conditions générales d'utilisation et comprends que je suis responsable du respect des lois applicables.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-full max-w-md"
            disabled={!form.getValues("terms_accepted") || !form.getValues("customs_declaration")}
          >
            Créer la tournée
          </Button>
        </div>
      </form>
    </Form>
  );
}
