import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, UserX } from "lucide-react";

interface ApprovedCarrierCardProps {
  carrier: any;
  onViewDetails: () => void;
  onSuspend: () => void;
}

export function ApprovedCarrierCard({ carrier, onViewDetails, onSuspend }: ApprovedCarrierCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="font-medium">{carrier.company_name}</div>
        <div className="text-sm text-gray-500">{carrier.email}</div>
        <div className="text-sm">{carrier.phone}</div>
        <div className="text-sm text-gray-500">
          {format(new Date(carrier.created_at), "dd MMMM yyyy", {
            locale: fr,
          })}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Voir les détails
          </Button>
          <Button
            variant="destructive"
            onClick={onSuspend}
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <UserX className="h-4 w-4" />
            Suspendre
          </Button>
        </div>
      </div>
    </Card>
  );
}