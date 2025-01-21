import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";
import { SenderStep } from "./steps/SenderStep";
import { RecipientStep } from "./steps/RecipientStep";
import { PackageStep } from "./steps/PackageStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";

interface BookingFormStepsProps {
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
  onEdit?: (step: number) => void;
}

export function BookingFormSteps({
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
  onPhotoUpload,
  onEdit
}: BookingFormStepsProps) {
  switch (currentStep) {
    case 1:
      return <SenderStep form={form} />;
    case 2:
      return <RecipientStep form={form} />;
    case 3:
      return (
        <PackageStep
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
    case 4:
      return (
        <ConfirmationStep
          form={form}
          onEdit={onEdit}
          weight={weight}
          specialItems={specialItems}
          itemQuantities={itemQuantities}
          pricePerKg={10}
        />
      );
    default:
      return null;
  }
}