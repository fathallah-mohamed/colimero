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
import { Search, UserX } from "lucide-react";

interface ApprovedCarriersTableProps {
  carriers: any[];
  onViewDetails: (carrier: any) => void;
  onSuspend: (carrierId: string) => void;
}

export function ApprovedCarriersTable({ carriers, onViewDetails, onSuspend }: ApprovedCarriersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Entreprise</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carriers?.map((carrier) => (
          <TableRow key={carrier.id}>
            <TableCell className="font-medium">{carrier.company_name}</TableCell>
            <TableCell>{carrier.email}</TableCell>
            <TableCell>{carrier.phone}</TableCell>
            <TableCell>
              {format(new Date(carrier.created_at), "dd MMMM yyyy", {
                locale: fr,
              })}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                onClick={() => onViewDetails(carrier)}
                className="inline-flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Détails
              </Button>
              <Button
                variant="destructive"
                onClick={() => onSuspend(carrier.id)}
                className="inline-flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                Suspendre
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}