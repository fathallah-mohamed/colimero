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
import { Card } from "@/components/ui/card";

interface RejectedRequestsTableProps {
  requests: any[];
  onViewDetails: (request: any) => void;
  onReapprove: (request: any) => void;
}

export function RejectedRequestsTable({ requests, onViewDetails, onReapprove }: RejectedRequestsTableProps) {
  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entreprise</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date de demande</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(request)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onReapprove(request)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Réapprouver
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}