import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carrier } from "@/types/carrier";
import { Building2, Mail, Phone } from "lucide-react";

interface RequestCardProps {
  request: Carrier;
  onSelect: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export function RequestCard({
  request,
  onSelect,
  onApprove,
  onReject,
}: RequestCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{request.company_name}</h3>
            <div className="flex items-center gap-2 text-gray-500">
              <Building2 className="h-4 w-4" />
              <span>{request.siret}</span>
            </div>
          </div>
          <Button variant="outline" onClick={onSelect}>
            Voir détails
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="h-4 w-4" />
            <span>{request.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Phone className="h-4 w-4" />
            <span>{request.phone}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onReject("Demande rejetée")}
            className="text-red-500 hover:text-red-600"
          >
            Rejeter
          </Button>
          <Button onClick={onApprove}>Approuver</Button>
        </div>
      </div>
    </Card>
  );
}