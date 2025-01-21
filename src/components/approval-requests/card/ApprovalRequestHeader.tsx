import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import type { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ApprovalRequestHeaderProps {
  request: ApprovalRequest;
  userType?: string;
}

export function ApprovalRequestHeader({ request, userType }: ApprovalRequestHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvée";
      case "rejected":
        return "Rejetée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Demande du {format(new Date(request.created_at), "d MMMM yyyy", { locale: fr })}
        </h3>
        <Badge className={getStatusColor(request.status)}>
          {getStatusLabel(request.status)}
        </Badge>
      </div>
      
      {request.tour && (
        <div className="text-sm text-gray-600">
          <p>
            {request.tour.departure_country} → {request.tour.destination_country}
          </p>
          <p>
            Transporteur : {request.tour.carrier.company_name}
          </p>
          {userType === 'carrier' && request.client && (
            <>
              <p>
                Client : {request.client.first_name} {request.client.last_name}
              </p>
              {request.client.phone && (
                <p>
                  Téléphone : {request.client.phone}
                </p>
              )}
            </>
          )}
          <p>
            Point de collecte : {request.pickup_city}
          </p>
        </div>
      )}
    </div>
  );
}