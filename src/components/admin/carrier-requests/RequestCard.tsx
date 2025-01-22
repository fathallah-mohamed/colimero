import { ApprovalRequest } from "../approval-requests/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestCardProps {
  request: ApprovalRequest;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function RequestCard({
  request,
  onClick,
  onApprove,
  onReject,
}: RequestCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div onClick={onClick} className="cursor-pointer">
          <h3 className="font-medium">
            {request.carrier?.company_name || 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">{request.carrier?.email || 'Email non disponible'}</p>
          <p className="text-sm text-gray-500 mt-2">
            {format(new Date(request.created_at), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <Badge variant={request.status === 'rejected' ? 'destructive' : 'default'}>
          {request.status}
        </Badge>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Approuver
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
          Rejeter
        </Button>
      </div>
    </Card>
  );
}