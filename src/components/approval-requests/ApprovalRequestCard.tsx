import React from "react";
import { CollectionPoint } from "./CollectionPoint";
import { RequestHeader } from "./RequestHeader";
import { RequestStatus } from "./RequestStatus";
import { RequestActions } from "./RequestActions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const selectedStop = request.tour?.route?.find(
    (stop: any) => stop.name === request.pickup_city
  );

  const handleBookNow = () => {
    if (request.status === 'approved') {
      navigate(`/reserver/${request.tour.id}?pickupCity=${encodeURIComponent(request.pickup_city)}`);
    } else {
      toast({
        title: "Action non disponible",
        description: "Vous ne pouvez réserver que lorsque votre demande est approuvée",
        variant: "destructive"
      });
    }
  };

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

        <div className="flex flex-col gap-2">
          <RequestActions 
            status={request.status}
            userType={userType}
            onApprove={onApprove}
            onReject={onReject}
            onCancel={onCancel}
            onDelete={onDelete}
          />
          
          {request.status === 'approved' && (
            <Button 
              onClick={handleBookNow}
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            >
              Réserver maintenant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}