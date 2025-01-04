import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, UserX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface CarrierTableProps {
  carriers: any[];
  onViewDetails: (carrier: any) => void;
  onSuspend: (carrierId: string) => void;
}

export function CarrierTable({ carriers, onViewDetails, onSuspend }: CarrierTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {carriers?.map((carrier) => (
          <Card key={carrier.id} className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{carrier.company_name}</h3>
                <p className="text-sm text-muted-foreground">{carrier.email}</p>
                <p className="text-sm">{carrier.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(carrier.created_at), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(carrier)}
                  className="w-full justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onSuspend(carrier.id)}
                  className="w-full justify-center"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Suspendre
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entreprise</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(carrier)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onSuspend(carrier.id)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Suspendre
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