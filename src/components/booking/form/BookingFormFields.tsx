import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingWeightSelector } from "../BookingWeightSelector";
import { BookingContentTypes } from "../BookingContentTypes";
import { BookingSpecialItems } from "../BookingSpecialItems";
import { BookingPhotoUpload } from "../BookingPhotoUpload";

const availableContentTypes = [
  "Documents",
  "Vêtements",
  "Électronique",
  "Nourriture",
  "Médicaments",
  "Autres"
];

const availableSpecialItems = [
  { name: "Fragile", price: 10, icon: "package" },
  { name: "Lourd", price: 15, icon: "package" },
  { name: "Périssable", price: 20, icon: "package" }
];

export interface BookingFormFieldsProps {
  form: UseFormReturn<BookingFormData>;
  weight: number;
  onWeightChange: (increment: boolean) => void;
  contentTypes: string[];
  onContentTypeToggle: (type: string) => void;
  specialItems: string[];
  onSpecialItemToggle: (item: string) => void;
  itemQuantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
  photos: File[];
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BookingFormFields({
  form,
  weight,
  onWeightChange,
  contentTypes,
  onContentTypeToggle,
  specialItems,
  onSpecialItemToggle,
  itemQuantities,
  onQuantityChange,
  photos,
  onPhotoUpload
}: BookingFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations expéditeur</h3>
          <FormField
            control={form.control}
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'expéditeur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} />
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
                <FormLabel>Téléphone de l'expéditeur</FormLabel>
                <FormControl>
                  <Input placeholder="+33 6 XX XX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations destinataire</h3>
          <FormField
            control={form.control}
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du destinataire</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} />
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
                  <Input placeholder="+33 6 XX XX XX XX" {...field} />
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
                  <Input placeholder="Adresse complète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipient_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville de livraison</FormLabel>
                <FormControl>
                  <Input placeholder="Ville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations du colis</h3>
        
        <BookingWeightSelector
          weight={weight}
          onWeightChange={onWeightChange}
        />

        <FormField
          control={form.control}
          name="item_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de colis</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Carton, valise..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <BookingContentTypes
          selectedTypes={contentTypes}
          onTypeToggle={onContentTypeToggle}
          contentTypes={availableContentTypes}
        />

        <BookingSpecialItems
          selectedItems={specialItems}
          onItemToggle={onSpecialItemToggle}
          itemQuantities={itemQuantities}
          onQuantityChange={onQuantityChange}
          specialItems={availableSpecialItems}
        />

        <FormField
          control={form.control}
          name="special_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions spéciales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Instructions particulières pour la manipulation ou la livraison..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <BookingPhotoUpload photos={photos} onPhotoUpload={onPhotoUpload} />
    </div>
  );
}