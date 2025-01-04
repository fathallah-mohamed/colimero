import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RejectedRequestCardProps {
  request: any;
  onViewDetails: (request: any) => void;
  onReapprove: (request: any) => void;
}

export function RejectedRequestCard({ request, onViewDetails, onReapprove }: RejectedRequestCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold">{request.company_name}</h3>
          <p className="text-sm text-muted-foreground">{request.email}</p>
          <p className="text-sm">{request.phone}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(request.created_at), "dd MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(request)}
            className="w-full justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Voir les détails
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onReapprove(request)}
            className="w-full justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Réapprouver
          </Button>
        </div>
      </div>
    </Card>
  );
}