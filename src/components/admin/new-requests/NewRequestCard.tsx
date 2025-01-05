import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search } from "lucide-react";

interface NewRequestCardProps {
  request: any;
  onViewDetails: () => void;
  showApproveButton?: boolean;
  onApprove?: () => void;
}

export function NewRequestCard({ 
  request, 
  onViewDetails,
  showApproveButton = false,
  onApprove 
}: NewRequestCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="font-medium">{request.company_name}</div>
        <div className="text-sm text-gray-500">{request.email}</div>
        <div className="text-sm">{request.phone}</div>
        <div className="text-sm text-gray-500">
          {format(new Date(request.created_at), "dd MMMM yyyy", {
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
        </div>
      </div>
    </Card>
  );
}