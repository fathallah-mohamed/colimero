import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import type { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ApprovalRequestActionsProps {
  request: ApprovalRequest;
  userType?: string;
  onApprove: (request: ApprovalRequest) => void;
  onReject: (request: ApprovalRequest) => void;
  onCancel: (requestId: string) => void;
  onDelete: (requestId: string) => void;
}

export function ApprovalRequestActions({
  request,
  userType,
  onApprove,
  onReject,
  onCancel,
  onDelete,
}: ApprovalRequestActionsProps) {
  // Actions pour les transporteurs
  if (userType === 'carrier') {
    return (
      <div className="flex gap-2">
        {request.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
              onClick={() => onApprove(request)}
            >
              <Check className="h-4 w-4 mr-2" />
              Approuver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
              onClick={() => onReject(request)}
            >
              <X className="h-4 w-4 mr-2" />
              Refuser
            </Button>
          </>
        )}
      </div>
    );
  }

  // Actions pour les clients
  return (
    <div className="flex gap-2">
      {request.status === 'pending' && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          onClick={() => onCancel(request.id)}
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      )}
      {request.status === 'rejected' && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          onClick={() => onDelete(request.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      )}
    </div>
  );
}