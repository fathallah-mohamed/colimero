import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CarrierTableProps {
  carriers: any[];
  onViewDetails: (carrier: any) => void;
  onSuspend: (carrierId: string) => void;
}

export function CarrierTable({ carriers, onViewDetails, onSuspend }: CarrierTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Entreprise</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="hidden md:table-cell whitespace-nowrap">Téléphone</TableHead>
            <TableHead className="hidden md:table-cell whitespace-nowrap">Date d'inscription</TableHead>
            <TableHead className="whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carriers?.map((carrier) => (
            <TableRow key={carrier.id}>
              <TableCell className="font-medium">{carrier.company_name}</TableCell>
              <TableCell>{carrier.email}</TableCell>
              <TableCell className="hidden md:table-cell">{carrier.phone}</TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(carrier.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="space-x-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(carrier)}
                  >
                    Détails
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onSuspend(carrier.id)}
                  >
                    Suspendre
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}