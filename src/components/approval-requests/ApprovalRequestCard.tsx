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
  return (
    <div key={request.id} className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {request.tour?.departure_country} → {request.tour?.destination_country}
            </h2>
            {userType === 'carrier' && request.user && (
              <>
                <p className="text-gray-600">
                  Client : {request.user.first_name} {request.user.last_name}
                </p>
                {request.user.phone && (
                  <p className="text-gray-600">
                    Téléphone : {request.user.phone}
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

          <div>
            <h3 className="font-medium text-gray-900">Points de collecte :</h3>
            <ul className="mt-2 space-y-2">
              {request.tour?.route?.map((stop: any, index: number) => (
                <li key={index} className="text-sm text-gray-600">
                  {stop.name} - {stop.location} ({stop.time})
                </li>
              ))}
            </ul>
          </div>

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