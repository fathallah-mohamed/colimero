import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";
import { SenderSection } from "./sections/SenderSection";
import { RecipientSection } from "./sections/RecipientSection";
import { PackageSection } from "./sections/PackageSection";

export interface BookingFormFieldsProps {
  form: UseFormReturn<BookingFormData>;
  contentTypes: string[];
  onContentTypeToggle: (type: string) => void;
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  itemQuantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
  onPhotosChange: (files: File[]) => void;
}

export function BookingFormFields({
  form,
  contentTypes,
  onContentTypeToggle,
  selectedItems,
  onItemToggle,
  itemQuantities,
  onQuantityChange,
  onPhotosChange
}: BookingFormFieldsProps) {
  return (
    <div className="space-y-8">
      <SenderSection form={form} />
      <RecipientSection form={form} />
      <PackageSection
        form={form}
        contentTypes={contentTypes}
        onContentTypeToggle={onContentTypeToggle}
        selectedItems={selectedItems}
        onItemToggle={onItemToggle}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
        onPhotosChange={onPhotosChange}
      />
    </div>
  );
}