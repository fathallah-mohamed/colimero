import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormData } from "../schema";
import { FormStepWrapper } from "./FormStepWrapper";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { BookingWeightSelector } from "../../BookingWeightSelector";
import { BookingContentTypes } from "../../BookingContentTypes";
import { BookingSpecialItems } from "../../BookingSpecialItems";
import { BookingPhotoUpload } from "../../BookingPhotoUpload";

interface PackageDetailsStepProps {
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

export function PackageDetailsStep({
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
}: PackageDetailsStepProps) {
  return (
    <FormStepWrapper title="Informations du colis">
      <FormFieldWrapper
        form={form}
        name="item_type"
        label="Type de colis"
      >
        <Input placeholder="Ex: Carton, valise..." />
      </FormFieldWrapper>

      <BookingWeightSelector
        weight={weight}
        onWeightChange={onWeightChange}
      />

      <BookingContentTypes
        selectedTypes={contentTypes}
        onTypeToggle={onContentTypeToggle}
        contentTypes={[
          "Vêtements",
          "Chaussures",
          "Jouets",
          "Livres",
          "Cosmétiques",
          "Accessoires",
          "Electronique",
          "Produits alimentaires",
          "Médicaments",
          "Documents"
        ]}
      />

      <BookingSpecialItems
        selectedItems={specialItems}
        onItemToggle={onSpecialItemToggle}
        specialItems={[
          { name: "Vélo", price: 50, icon: "bicycle" },
          { name: "Trottinette", price: 30, icon: "scooter" },
          { name: "Télévision", price: 80, icon: "tv" },
          { name: "Meuble", price: 100, icon: "cabinet" },
          { name: "Instrument de musique", price: 70, icon: "music" },
          { name: "Équipement sportif", price: 40, icon: "dumbbell" }
        ]}
        itemQuantities={itemQuantities}
        onQuantityChange={onQuantityChange}
      />

      <FormFieldWrapper
        form={form}
        name="package_description"
        label="Description du colis"
      >
        <Textarea 
          placeholder="Décrivez votre colis..." 
          className="min-h-[100px]"
        />
      </FormFieldWrapper>

      <BookingPhotoUpload 
        photos={photos}
        onPhotoUpload={onPhotoUpload}
      />
    </FormStepWrapper>
  );
}