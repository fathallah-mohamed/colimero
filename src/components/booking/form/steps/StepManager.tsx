import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { SenderDetailsStep } from "./SenderDetailsStep";
import { RecipientDetailsStep } from "./RecipientDetailsStep";
import { PackageDetailsStep } from "./PackageDetailsStep";

interface StepManagerProps {
  currentStep: number;
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

export function StepManager({
  currentStep,
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
}: StepManagerProps) {
  switch (currentStep) {
    case 1:
      return <SenderDetailsStep form={form} />;
    case 2:
      return <RecipientDetailsStep form={form} />;
    case 3:
      return (
        <PackageDetailsStep
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
      );
    default:
      return null;
  }
}