import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Check, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  if (!request || !request.tour || !request.client) {
    return null;
  }

  const statusLabels = {
    'pending': 'En attente',
    'approved': 'Approuvée',
    'rejected': 'Refusée',
    'cancelled': 'Annulée'
  };

  const statusVariants: Record<string, "default" | "destructive" | "outline" | "secondary" | "success" | "warning"> = {
    'pending': 'outline',
    'approved': 'success',
    'rejected': 'destructive',
    'cancelled': 'destructive'
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(request);
      setShowCancelDialog(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(request);
      setShowDeleteDialog(false);
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
                {request.client.first_name} {request.client.last_name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="h-4 w-4" />
              <p>{request.client.email}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="h-4 w-4" />
              <p>{request.client.phone || "Non renseigné"}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <p>Ville de collecte: {request.pickup_city}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={statusVariants[request.status as keyof typeof statusVariants] || 'outline'}>
              {statusLabels[request.status as keyof typeof statusLabels] || request.status}
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
                {request.tour.departure_country} → {request.tour.destination_country}
              </p>
              <p>
                <span className="text-gray-500">Date de départ:</span>{" "}
                {format(new Date(request.tour.departure_date), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
              <p>
                <span className="text-gray-500">Date de collecte:</span>{" "}
                {format(new Date(request.tour.collection_date), "dd MMMM yyyy", {
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
                {request.tour.total_capacity} kg
              </p>
              <p>
                <span className="text-gray-500">Capacité restante:</span>{" "}
                {request.tour.remaining_capacity} kg
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
            {request.status === 'pending' && userType === 'carrier' && (
              <>
                <Button
                  variant="default"
                  onClick={() => onApprove?.(request)}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReject?.(request)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Refuser
                </Button>
              </>
            )}
            {request.status === 'pending' && userType !== 'carrier' && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            )}
            {request.status === 'cancelled' && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette demande d'approbation ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Retour
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Annuler la demande
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}