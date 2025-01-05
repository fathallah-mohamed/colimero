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
import { Search, Check } from "lucide-react";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Entreprise</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date de demande</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.company_name}</TableCell>
            <TableCell>{request.email}</TableCell>
            <TableCell>{request.phone}</TableCell>
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
                Détails
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
  );
}