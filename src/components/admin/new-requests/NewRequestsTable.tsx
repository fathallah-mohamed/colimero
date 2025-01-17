import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Check, User, Eye, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { ClientDetailsDialog } from "../client-details/ClientDetailsDialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface NewRequestsTableProps {
  requests: any[];
  onViewDetails: (request: any) => void;
  showApproveButton?: boolean;
  onApprove?: (request: any) => void;
}

export function NewRequestsTable({ 
  requests, 
  onViewDetails, 
  showApproveButton = false,
  onApprove 
}: NewRequestsTableProps) {
  const [selectedClient, setSelectedClient] = useState<any>(null);

  return (
    <>
      <div className="space-y-4">
        {requests?.map((request) => (
          <Card key={request.id} className="p-6">
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
                  <Badge variant={request.status === 'pending' ? 'outline' : request.status === 'approved' ? 'success' : 'destructive'}>
                    {request.status === 'pending' ? 'En attente' : 
                     request.status === 'approved' ? 'Approuvée' : 'Refusée'}
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
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(request.user)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profil client
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(request)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Détails demande
                </Button>
                {showApproveButton && request.status === 'pending' && onApprove && (
                  <Button
                    variant="default"
                    onClick={() => onApprove(request)}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approuver
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune demande d'approbation
          </div>
        )}
      </div>

      <ClientDetailsDialog 
        client={selectedClient} 
        onClose={() => setSelectedClient(null)} 
      />
    </>
  );
}