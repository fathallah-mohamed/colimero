import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { BookingContentTypes } from "../../BookingContentTypes";
import { BookingSpecialItems } from "../../BookingSpecialItems";
import { BookingPhotoUpload } from "../../BookingPhotoUpload";
import { BookingWeightSelector } from "../../BookingWeightSelector";
import { availableContentTypes } from "../constants/contentTypes";
import { availableSpecialItems } from "../constants/specialItems";

interface PackageSectionProps {
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

export function PackageSection({
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
}: PackageSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations du colis</h3>
      
      <FormField
        control={form.control}
        name="item_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de colis</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Carton, valise..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <BookingWeightSelector
        weight={weight}
        onWeightChange={onWeightChange}
      />

      <BookingContentTypes
        selectedTypes={contentTypes}
        onTypeToggle={onContentTypeToggle}
        contentTypes={[...availableContentTypes]}
      />

      <BookingSpecialItems
        selectedItems={specialItems}
        onItemToggle={onSpecialItemToggle}
        specialItems={[...availableSpecialItems]}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
      />

      <FormField
        control={form.control}
        name="package_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description du colis</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre colis..." 
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <BookingPhotoUpload 
        photos={photos}
        onPhotoUpload={onPhotoUpload}
      />
    </div>
  );
}