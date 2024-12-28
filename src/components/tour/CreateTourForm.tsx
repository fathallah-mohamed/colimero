import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StopPoint } from "./StopPoint";

const formSchema = z.object({
  departure_country: z.string(),
  destination_country: z.string(),
  departure_date: z.string(),
  total_capacity: z.string().transform(Number),
  price_per_kg: z.string().transform(Number),
  type: z.enum(["public", "private"]),
  route: z.array(z.object({
    name: z.string(),
    location: z.string(),
    time: z.string(),
    type: z.literal("pickup")
  })).min(1, "Au moins un point de collecte est requis")
});

export function CreateTourForm() {
  const [stops, setStops] = useState([{ id: 1 }]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure_country: "FR",
      destination_country: "TN",
      type: "public",
      route: []
    },
  });

  const addStop = () => {
    setStops([...stops, { id: stops.length + 1 }]);
  };

  const removeStop = (stopId: number) => {
    setStops(stops.filter((stop) => stop.id !== stopId));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: carrier } = await supabase
        .from("carriers")
        .select("id")
        .single();

      if (!carrier) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté en tant que transporteur",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("tours").insert({
        carrier_id: carrier.id,
        departure_country: values.departure_country,
        destination_country: values.destination_country,
        departure_date: values.departure_date,
        total_capacity: values.total_capacity,
        remaining_capacity: values.total_capacity,
        type: values.type,
        route: values.route
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La tournée a été créée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tournée",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departure_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays de départ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="TN">Tunisie</SelectItem>
                    <SelectItem value="DZ">Algérie</SelectItem>
                    <SelectItem value="MA">Maroc</SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TN">Tunisie</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="DZ">Algérie</SelectItem>
                    <SelectItem value="MA">Maroc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="departure_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de départ</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </FormControl>
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité totale (kg)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_per_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix par kg (€)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Points de collecte</h3>
            <Button type="button" variant="outline" onClick={addStop}>
              Ajouter un point
            </Button>
          </div>
          
          {stops.map((stop) => (
            <StopPoint
              key={stop.id}
              stopId={stop.id}
              form={form}
              onRemove={() => stops.length > 1 && removeStop(stop.id)}
            />
          ))}
        </div>

        <Button type="submit" className="w-full">
          Créer la tournée
        </Button>
      </form>
    </Form>
  );
}