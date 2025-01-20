import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ApprovalRequestCardProps {
  request: any;
  userType?: string;
  showActions?: boolean;
  onApprove?: (request: any) => void;
  onReject?: (request: any) => void;
  onCancel?: (request: any) => void;
  onDelete?: (request: any) => void;
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
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'approved':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Refusée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* En-tête avec les informations du client */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">
                {request.user?.first_name} {request.user?.last_name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="h-4 w-4" />
              <p>{request.user?.email}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="h-4 w-4" />
              <p>{request.user?.phone || "Non renseigné"}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <p>Ville de collecte: {request.pickup_city}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={getStatusBadgeVariant(request.status)}>
              {getStatusLabel(request.status)}
            </Badge>
            <p className="text-sm text-gray-500 mt-2">
              Demande du {format(new Date(request.created_at), "dd MMMM yyyy", {
                locale: fr,
              })}
            </p>
          </div>
        </div>

        {/* Informations sur la tournée */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Détails de la tournée</h4>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Trajet:</span>{" "}
                {request.tour?.departure_country} → {request.tour?.destination_country}
              </p>
              <p>
                <span className="text-gray-500">Date de départ:</span>{" "}
                {format(new Date(request.tour?.departure_date), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
              <p>
                <span className="text-gray-500">Date de collecte:</span>{" "}
                {format(new Date(request.tour?.collection_date), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Capacités</h4>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Capacité totale:</span>{" "}
                {request.tour?.total_capacity} kg
              </p>
              <p>
                <span className="text-gray-500">Capacité restante:</span>{" "}
                {request.tour?.remaining_capacity} kg
              </p>
            </div>
          </div>
        </div>

        {/* Message du client */}
        {request.message && (
          <div>
            <h4 className="font-medium mb-2">Message du client</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {request.message}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex justify-end gap-3">
            {request.status === 'pending' && (
              <>
                {userType === 'carrier' ? (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => onReject?.(request)}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Refuser
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => onApprove?.(request)}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Approuver
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => onCancel?.(request)}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler ma demande
                  </Button>
                )}
              </>
            )}
            {request.status === 'cancelled' && userType !== 'carrier' && (
              <Button
                variant="destructive"
                onClick={() => onDelete?.(request)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Supprimer
              </Button>
            )}
            <Button
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <Link to={`/tours/${request.tour_id}`}>
                Voir la tournée
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}