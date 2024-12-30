import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecipientInfoProps {
  formData: {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryCity: string;
  };
  setFormData: (data: any) => void;
  destinationCountry: string;
}

const destinationCities = {
  'TN': [
    { name: 'Tunis', location: 'Centre ville', hours: '9h-17h' },
    { name: 'Sfax', location: 'Port de Sfax', hours: '8h-16h' },
    { name: 'Sousse', location: 'Centre ville', hours: '9h-17h' }
  ],
  'MA': [
    { name: 'Casablanca', location: 'Centre ville', hours: '9h-17h' },
    { name: 'Rabat', location: 'Médina', hours: '8h-16h' },
    { name: 'Tanger', location: 'Port de Tanger', hours: '9h-17h' }
  ],
  'DZ': [
    { name: 'Alger', location: 'Centre ville', hours: '9h-17h' },
    { name: 'Oran', location: 'Port d\'Oran', hours: '8h-16h' },
    { name: 'Constantine', location: 'Centre ville', hours: '9h-17h' }
  ]
};

export function RecipientInfo({ formData, setFormData, destinationCountry }: RecipientInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations du destinataire</h3>
      <div>
        <Label>Nom et prénom</Label>
        <Input
          placeholder="Entrez le nom et prénom du destinataire"
          value={formData.recipientName}
          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Numéro de téléphone du destinataire</Label>
        <div className="flex gap-2">
          <Select defaultValue={destinationCountry}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TN">Tunisie (+216)</SelectItem>
              <SelectItem value="MA">Maroc (+212)</SelectItem>
              <SelectItem value="DZ">Algérie (+213)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            placeholder="Numéro de téléphone"
            value={formData.recipientPhone}
            onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
            required
            className="flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Ville de livraison</Label>
        <Select 
          value={formData.deliveryCity}
          onValueChange={(value) => setFormData({ ...formData, deliveryCity: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisissez une ville de livraison" />
          </SelectTrigger>
          <SelectContent>
            {destinationCities[destinationCountry as keyof typeof destinationCities]?.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                <div className="space-y-1">
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.location}</div>
                  <div className="text-sm text-gray-500">Horaires : {city.hours}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Adresse complète</Label>
        <Textarea
          placeholder="Adresse complète du destinataire"
          value={formData.recipientAddress}
          onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
          required
        />
      </div>
    </div>
  );
}