import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { BookingContentTypes } from "../../BookingContentTypes";
import { BookingSpecialItems } from "../../BookingSpecialItems";
import { BookingPhotoUpload } from "../../BookingPhotoUpload";
import { availableContentTypes } from "../constants/contentTypes";
import { availableSpecialItems } from "../constants/specialItems";

interface PackageSectionProps {
  form: UseFormReturn<BookingFormData>;
  contentTypes: string[];
  onContentTypeToggle: (type: string) => void;
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  itemQuantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
  onPhotosChange: (files: File[]) => void;
}

export function PackageSection({
  form,
  contentTypes,
  onContentTypeToggle,
  selectedItems,
  onItemToggle,
  itemQuantities,
  onQuantityChange,
  onPhotosChange
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

      <BookingContentTypes
        selectedTypes={contentTypes}
        onTypeToggle={onContentTypeToggle}
        contentTypes={availableContentTypes}
      />

      <BookingSpecialItems
        selectedItems={selectedItems}
        onItemToggle={onItemToggle}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
        specialItems={availableSpecialItems}
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

      <BookingPhotoUpload onPhotosChange={onPhotosChange} />
    </div>
  );
}