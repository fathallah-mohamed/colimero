import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ApprovalRequestCardProps {
  request: ApprovalRequest;
  userType?: string;
  showActions?: boolean;
  onApprove?: (request: ApprovalRequest) => void;
  onReject?: (request: ApprovalRequest) => void;
  onCancel?: (requestId: string) => void;
  onDelete?: (requestId: string) => void;
}

export function ApprovalRequestCard({ 
  request, 
  userType,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  onDelete 
}: ApprovalRequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Early return if client data is missing
  if (!request.client) {
    console.error("Missing client data for request:", request.id);
    return null;
  }

  return (
    <Card 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {request.client.first_name || 'N/A'} {request.client.last_name || 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">{request.client.email || 'Email non disponible'}</p>
          <p className="text-sm text-gray-500 mt-2">
            {format(new Date(request.created_at), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge className={getStatusColor(request.status)}>
            {request.status === "pending" ? "En attente" : 
             request.status === "approved" ? "Approuvée" : 
             request.status === "rejected" ? "Rejetée" : request.status}
          </Badge>
          
          {showActions && request.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReject) onReject(request);
                }}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Rejeter
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onApprove) onApprove(request);
                }}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Approuver
              </Button>
            </div>
          )}
          
          {showActions && request.status === "cancelled" && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(request.id);
              }}
              className="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          )}
          
          {showActions && request.status === "pending" && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(request.id);
              }}
              className="text-gray-600 hover:text-gray-700"
            >
              Annuler
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// Make sure we have a named export
export type { ApprovalRequestCardProps };