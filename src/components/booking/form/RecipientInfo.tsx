import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/booking";

interface RecipientInfoProps {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  destinationCountry: string;
}

export function RecipientInfo({ formData, setFormData, destinationCountry }: RecipientInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations du destinataire</h3>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="recipientName">Nom complet</Label>
          <Input
            id="recipientName"
            value={formData.recipient_name}
            onChange={(e) =>
              setFormData({ recipient_name: e.target.value })
            }
            placeholder="Nom du destinataire"
          />
        </div>
        <div>
          <Label htmlFor="recipientPhone">Téléphone</Label>
          <Input
            id="recipientPhone"
            value={formData.recipient_phone}
            onChange={(e) =>
              setFormData({ recipient_phone: e.target.value })
            }
            placeholder="Numéro de téléphone"
          />
        </div>
        <div>
          <Label htmlFor="recipientAddress">Adresse</Label>
          <Input
            id="recipientAddress"
            value={formData.recipient_address}
            onChange={(e) =>
              setFormData({ recipient_address: e.target.value })
            }
            placeholder="Adresse de livraison"
          />
        </div>
        <div>
          <Label htmlFor="deliveryCity">Ville de livraison ({destinationCountry})</Label>
          <Input
            id="deliveryCity"
            value={formData.delivery_city}
            onChange={(e) =>
              setFormData({ delivery_city: e.target.value })
            }
            placeholder="Ville de livraison"
          />
        </div>
      </div>
    </div>
  );
}