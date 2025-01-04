import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ClientCardProps {
  client: any;
}

export function ClientCard({ client }: ClientCardProps) {
  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-primary/70 mt-1" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  );

  const formattedDate = client.created_at 
    ? format(new Date(client.created_at), 'PPP', { locale: fr })
    : '-';

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">
          {client.first_name} {client.last_name}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem 
            icon={Mail} 
            label="Email" 
            value={client.email} 
          />
          <InfoItem 
            icon={Phone} 
            label="Téléphone" 
            value={client.phone} 
          />
          <InfoItem 
            icon={MapPin} 
            label="Adresse" 
            value={client.address} 
          />
          <InfoItem 
            icon={Calendar} 
            label="Date de naissance" 
            value={client.birth_date ? format(new Date(client.birth_date), 'dd/MM/yyyy', { locale: fr }) : null} 
          />
          <InfoItem 
            icon={Calendar} 
            label="Membre depuis" 
            value={formattedDate} 
          />
        </div>
      </CardContent>
    </Card>
  );
}