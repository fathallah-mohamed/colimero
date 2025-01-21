import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "../schema";
import { FormStepWrapper } from "./FormStepWrapper";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface RecipientDetailsStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function RecipientDetailsStep({ form }: RecipientDetailsStepProps) {
  return (
    <FormStepWrapper title="Informations du destinataire">
      <FormFieldWrapper
        form={form}
        name="recipient_name"
        label="Nom complet"
      >
        <Input placeholder="Nom du destinataire" />
      </FormFieldWrapper>

      <FormFieldWrapper
        form={form}
        name="recipient_phone"
        label="Téléphone"
      >
        <Input placeholder="Numéro de téléphone" />
      </FormFieldWrapper>

      <FormFieldWrapper
        form={form}
        name="recipient_address"
        label="Adresse"
      >
        <Input placeholder="Adresse de livraison" />
      </FormFieldWrapper>

      <FormFieldWrapper
        form={form}
        name="delivery_city"
        label="Ville de livraison"
      >
        <Input placeholder="Ville de livraison" />
      </FormFieldWrapper>
    </FormStepWrapper>
  );
}