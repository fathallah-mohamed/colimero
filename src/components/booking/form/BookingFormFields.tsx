import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";
import { SenderSection } from "./sections/SenderSection";
import { RecipientSection } from "./sections/RecipientSection";
import { PackageSection } from "./sections/PackageSection";

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
    <div className="space-y-8">
      <SenderSection form={form} />
      <RecipientSection form={form} />
      <PackageSection
        form={form}
        weight={weight}
        onWeightChange={onWeightChange}
        contentTypes={contentTypes}
        onContentTypeToggle={onContentTypeToggle}
        specialItems={specialItems}
        onSpecialItemToggle={onSpecialItemToggle}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
        photos={photos}
        onPhotoUpload={onPhotoUpload}
      />
    </div>
  );
}