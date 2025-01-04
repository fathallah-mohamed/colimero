import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RejectedRequestsTableProps {
  requests: any[];
  onViewDetails: (request: any) => void;
  onReapprove: (request: any) => void;
}

export function RejectedRequestsTable({ requests, onViewDetails, onReapprove }: RejectedRequestsTableProps) {
  return (
    <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
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
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                  Détails
                </Button>
                <Button
                  variant="default"
                  onClick={() => onReapprove(request)}
                  className="inline-flex items-center gap-2"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Réapprouver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}