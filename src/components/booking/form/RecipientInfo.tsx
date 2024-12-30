import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RecipientInfoProps {
  formData: {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryCity: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    senderName: string;
    senderPhone: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryCity: string;
  }>>;
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
            value={formData.recipientName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipientName: e.target.value }))
            }
            placeholder="Nom du destinataire"
          />
        </div>
        <div>
          <Label htmlFor="recipientPhone">Téléphone</Label>
          <Input
            id="recipientPhone"
            value={formData.recipientPhone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipientPhone: e.target.value }))
            }
            placeholder="Numéro de téléphone"
          />
        </div>
        <div>
          <Label htmlFor="recipientAddress">Adresse</Label>
          <Input
            id="recipientAddress"
            value={formData.recipientAddress}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recipientAddress: e.target.value }))
            }
            placeholder="Adresse de livraison"
          />
        </div>
        <div>
          <Label htmlFor="deliveryCity">Ville de livraison ({destinationCountry})</Label>
          <Input
            id="deliveryCity"
            value={formData.deliveryCity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deliveryCity: e.target.value }))
            }
            placeholder="Ville de livraison"
          />
        </div>
      </div>
    </div>
  );
}