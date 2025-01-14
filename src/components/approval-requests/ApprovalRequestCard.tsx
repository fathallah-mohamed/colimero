import React from "react";
import { CollectionPoint } from "./CollectionPoint";
import { RequestHeader } from "./RequestHeader";
import { RequestStatus } from "./RequestStatus";
import { RequestActions } from "./RequestActions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ApprovalRequestCardProps {
  request: {
    tour: any;
    user: any;
    status: string;
    reason: string;
    pickup_city: string;
    created_at: string;
  };
  userType?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function ApprovalRequestCard({ 
  request, 
  userType,
  onApprove,
  onReject,
  onCancel,
  onDelete 
}: ApprovalRequestCardProps) {
  const selectedStop = request.tour?.route?.find(
    (stop: any) => stop.name === request.pickup_city
  );

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-6">
        {/* Informations du client */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Informations du client</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">
                {request.user?.first_name} {request.user?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{request.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{request.user?.phone || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de la demande</p>
              <p className="font-medium">
                {format(new Date(request.created_at), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* Informations de la tournée */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Détails de la tournée</h3>
          <RequestHeader 
            tour={request.tour}
          />
        </div>

        {selectedStop && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Point de collecte</h3>
            <CollectionPoint selectedStop={selectedStop} />
          </div>
        )}

        <RequestStatus 
          status={request.status}
          message={request.reason}
        />

        <RequestActions 
          status={request.status}
          userType={userType}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}