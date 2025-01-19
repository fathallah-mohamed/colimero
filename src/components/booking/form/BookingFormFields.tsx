import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingWeightSelector } from "../BookingWeightSelector";
import { BookingContentTypes } from "../BookingContentTypes";
import { BookingSpecialItems } from "../BookingSpecialItems";
import { BookingPhotoUpload } from "../BookingPhotoUpload";

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
      <BookingWeightSelector weight={weight} onWeightChange={onWeightChange} />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre nom</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-gray-100" />
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
                <Input {...field} type="tel" readOnly className="bg-gray-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

        <FormField
          control={form.control}
          name="recipient_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville de livraison</FormLabel>
              <FormControl>
                <Input {...field} />
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
          name="special_instructions"
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

      <BookingContentTypes
        selectedTypes={contentTypes}
        onTypeToggle={onContentTypeToggle}
        contentTypes={["Vêtements", "Alimentaire", "Électronique", "Documents"]}
      />

      <BookingSpecialItems
        selectedItems={specialItems}
        onItemToggle={onSpecialItemToggle}
        specialItems={[
          { name: "Fragile", price: 10, icon: "package" },
          { name: "Lourd", price: 15, icon: "package" },
          { name: "Périssable", price: 20, icon: "package" }
        ]}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
      />

      <BookingPhotoUpload photos={photos} onPhotoUpload={onPhotoUpload} />
    </div>
  );
}
