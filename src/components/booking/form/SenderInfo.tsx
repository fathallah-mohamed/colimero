import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@/types/booking";

interface SenderInfoProps {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
}

export function SenderInfo({ formData }: SenderInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations de l'expéditeur</h3>
      <div>
        <Label>Nom et prénom</Label>
        <Input
          value={formData.sender_name}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label>Votre numéro de téléphone</Label>
        <div className="flex gap-2">
          <Select defaultValue="FR" disabled>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR">France (+33)</SelectItem>
              <SelectItem value="TN">Tunisie (+216)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={formData.sender_phone}
            readOnly
            className="flex-1 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}