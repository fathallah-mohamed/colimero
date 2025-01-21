import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "../schema";
import { FormStepWrapper } from "./FormStepWrapper";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface SenderDetailsStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function SenderDetailsStep({ form }: SenderDetailsStepProps) {
  return (
    <FormStepWrapper title="Informations de l'expéditeur">
      <FormFieldWrapper
        form={form}
        name="sender_name"
        label="Nom complet"
      >
        <Input placeholder="Votre nom" />
      </FormFieldWrapper>

      <FormFieldWrapper
        form={form}
        name="sender_phone"
        label="Téléphone"
      >
        <Input placeholder="Votre numéro de téléphone" />
      </FormFieldWrapper>
    </FormStepWrapper>
  );
}