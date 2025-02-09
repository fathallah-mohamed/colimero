import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ApprovalRequest } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface RequestCardProps {
  request: ApprovalRequest;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function RequestCard({ request, onClick, onApprove, onReject }: RequestCardProps) {
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

  return (
    <Card 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start">
        <div onClick={onClick}>
          <h3 className="font-medium">
            {request.carrier?.first_name || 'N/A'} {request.carrier?.last_name || ''}
          </h3>
          <p className="text-sm text-gray-600">{request.carrier?.email || 'Email non disponible'}</p>
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
          
          {request.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
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
                  onApprove();
                }}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Approuver
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}