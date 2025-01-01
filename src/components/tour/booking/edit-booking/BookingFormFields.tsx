import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "./FormField";

interface BookingFormFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function BookingFormFields({ formData, onChange }: BookingFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField>
        <Label htmlFor="sender_name">Nom de l'expéditeur</Label>
        <Input
          id="sender_name"
          value={formData.sender_name}
          onChange={(e) => onChange("sender_name", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="sender_phone">Téléphone de l'expéditeur</Label>
        <Input
          id="sender_phone"
          value={formData.sender_phone}
          onChange={(e) => onChange("sender_phone", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="recipient_name">Nom du destinataire</Label>
        <Input
          id="recipient_name"
          value={formData.recipient_name}
          onChange={(e) => onChange("recipient_name", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="recipient_phone">Téléphone du destinataire</Label>
        <Input
          id="recipient_phone"
          value={formData.recipient_phone}
          onChange={(e) => onChange("recipient_phone", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="recipient_address">Adresse du destinataire</Label>
        <Input
          id="recipient_address"
          value={formData.recipient_address}
          onChange={(e) => onChange("recipient_address", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="delivery_city">Ville de livraison</Label>
        <Input
          id="delivery_city"
          value={formData.delivery_city}
          onChange={(e) => onChange("delivery_city", e.target.value)}
        />
      </FormField>

      <FormField>
        <Label htmlFor="weight">Poids (kg)</Label>
        <Input
          id="weight"
          type="number"
          value={formData.weight}
          onChange={(e) => onChange("weight", parseFloat(e.target.value))}
        />
      </FormField>
    </div>
  );
}