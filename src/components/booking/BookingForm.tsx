import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { useBookingForm } from "@/hooks/useBookingForm";
import { useState } from "react";

const contentTypes = [
  "Vêtements",
  "Électronique",
  "Documents",
  "Alimentaire",
  "Cosmétiques",
  "Autres",
];

const formSchema = z.object({
  weight: z.number().min(5).max(30),
  recipient_name: z.string().min(2, "Le nom du destinataire est requis"),
  recipient_address: z.string().min(5, "L'adresse de livraison est requise"),
  recipient_phone: z.string().min(8, "Le numéro de téléphone est requis"),
  sender_name: z.string().min(2, "Votre nom est requis"),
  sender_phone: z.string().min(8, "Votre numéro de téléphone est requis"),
  item_type: z.string().min(2, "Le type de colis est requis"),
  special_items: z.string().optional(),
});

export interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess }: BookingFormProps) {
  const [weight, setWeight] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 5,
      recipient_name: "",
      recipient_address: "",
      recipient_phone: "",
      sender_name: "",
      sender_phone: "",
      item_type: "",
      special_items: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      weight,
      pickup_city: pickupCity,
      delivery_city: "À définir",
      content_types: selectedTypes,
      photos: photos,
    };

    const { success } = await createBooking(formData);
    if (success) {
      form.reset();
      setWeight(5);
      setSelectedTypes([]);
      setPhotos([]);
    }
  };

  const handleWeightChange = (increment: boolean) => {
    setWeight((prev) => {
      if (increment && prev < 30) return prev + 1;
      if (!increment && prev > 5) return prev - 1;
      return prev;
    });
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BookingWeightSelector
          weight={weight}
          onWeightChange={handleWeightChange}
        />

        <BookingContentTypes
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          contentTypes={contentTypes}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du destinataire</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de livraison</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone du destinataire</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sender_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre téléphone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="item_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du colis</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Vêtements, documents..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="special_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions spéciales (optionnel)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ex: Fragile, manipuler avec précaution..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <BookingPhotoUpload
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création en cours..." : "Réserver"}
        </Button>
      </form>
    </Form>
  );
}