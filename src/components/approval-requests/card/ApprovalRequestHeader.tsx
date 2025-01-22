import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ApprovalRequestHeaderProps {
  request: ApprovalRequest;
  userType?: string;
}

export function ApprovalRequestHeader({ request, userType }: ApprovalRequestHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        {request.tour.departure_country} → {request.tour.destination_country}
      </h2>
      <p className="text-gray-600">
        Transporteur : {request.tour.carrier.company_name}
      </p>
      {userType === 'carrier' && request.client && (
        <>
          <p className="text-gray-600">
            Client : {request.client.first_name} {request.client.last_name}
          </p>
          {request.client.phone && (
            <p className="text-gray-600">
              Téléphone : {request.client.phone}
            </p>
          )}
        </>
      )}
      <p className="text-gray-600">
        Ville de ramassage : {request.pickup_city}
      </p>
      <p className="text-gray-600">
        Date de départ : {request.tour.departure_date ? 
          format(new Date(request.tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
          'Non spécifiée'}
      </p>
      <p className="text-gray-600">
        Statut : <span className={`font-medium ${
          request.status === 'pending' ? 'text-yellow-600' :
          request.status === 'approved' ? 'text-green-600' :
          'text-red-600'
        }`}>
          {request.status === 'pending' ? 'En attente' :
           request.status === 'approved' ? 'Approuvée' :
           request.status === 'cancelled' ? 'Annulée' :
           'Rejetée'}
        </span>
      </p>
      {request.message && (
        <p className="text-gray-600">
          Message : {request.message}
        </p>
      )}
    </div>
  );
}