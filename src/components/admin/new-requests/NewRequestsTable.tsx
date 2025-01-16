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
import { Search, Check, User } from "lucide-react";
import { useState } from "react";
import { ClientDetailsDialog } from "../client-details/ClientDetailsDialog";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Détails</TableHead>
            <TableHead>Tournée</TableHead>
            <TableHead>Date de demande</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                <div className="space-y-1">
                  <p>{request.user?.first_name} {request.user?.last_name}</p>
                  <p className="text-sm text-gray-500">{request.user?.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>Tél: {request.user?.phone || "Non renseigné"}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClient(request.user)}
                    className="w-full mt-2"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Voir détails client
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>Ville de collecte: {request.pickup_city}</p>
                  <p className="text-sm text-gray-500">
                    Message: {request.message || "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>{request.tour?.departure_country} → {request.tour?.destination_country}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(request.tour?.departure_date), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(request)}
                  className="inline-flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Détails demande
                </Button>
                {showApproveButton && onApprove && (
                  <Button
                    variant="default"
                    onClick={() => onApprove(request)}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approuver
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ClientDetailsDialog 
        client={selectedClient} 
        onClose={() => setSelectedClient(null)} 
      />
    </>
  );
}