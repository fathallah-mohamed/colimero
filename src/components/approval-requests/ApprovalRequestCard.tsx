import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ApprovalRequestCardProps {
  request: any;
  userType: string | null;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
}

export function ApprovalRequestCard({ 
  request, 
  userType,
  onApprove,
  onReject,
  onCancel
}: ApprovalRequestCardProps) {
  // Trouver le point de collecte sélectionné
  const selectedStop = request.tour?.route?.find((stop: any) => 
    stop.name === request.pickup_city
  );

  return (
    <div key={request.id} className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {request.tour?.departure_country} → {request.tour?.destination_country}
            </h2>
            <p className="text-gray-600">
              Transporteur : {request.tour?.carriers?.company_name}
            </p>
            {userType === 'carrier' && request.user && (
              <>
                <p className="text-gray-600">
                  Client : {request.user.raw_user_meta_data_first_name} {request.user.raw_user_meta_data_last_name}
                </p>
                {request.user.raw_user_meta_data_phone && (
                  <p className="text-gray-600">
                    Téléphone : {request.user.raw_user_meta_data_phone}
                  </p>
                )}
              </>
            )}
            <p className="text-gray-600">
              Date de départ : {request.tour?.departure_date ? 
                format(new Date(request.tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
                'Non spécifiée'}
            </p>
          </div>

          {selectedStop && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Point de collecte sélectionné :</h3>
              <p className="text-sm text-gray-600">
                {selectedStop.name} - {selectedStop.location}
              </p>
              <p className="text-sm text-gray-600">
                Date de collecte : {selectedStop.collection_date ? 
                  format(new Date(selectedStop.collection_date), "EEEE d MMMM yyyy", { locale: fr }) : 
                  'Non spécifiée'}
              </p>
              <p className="text-sm text-gray-600">
                Heure : {selectedStop.time}
              </p>
            </div>
          )}

          <div>
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
              <p className="text-gray-600 mt-2">
                Message : {request.message}
              </p>
            )}
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2">
            {userType === 'carrier' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => onReject?.(request.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Rejeter
                </Button>
                <Button onClick={() => onApprove?.(request.id)}>
                  Approuver
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => onCancel?.(request.id)}
                className="text-red-600 hover:text-red-700"
              >
                Annuler la demande
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}