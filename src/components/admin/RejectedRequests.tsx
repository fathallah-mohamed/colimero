import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export default function RejectedRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["rejected-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", "rejected")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredRequests = requests?.filter(
    (request) =>
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

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
          {filteredRequests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.company_name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.phone}</TableCell>
              <TableCell>
                {format(new Date(request.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                >
                  Voir les détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la demande - {selectedRequest?.company_name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Informations personnelles</h3>
              <p>Prénom : {selectedRequest?.first_name}</p>
              <p>Nom : {selectedRequest?.last_name}</p>
              <p>Email : {selectedRequest?.email}</p>
              <p>Téléphone : {selectedRequest?.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informations entreprise</h3>
              <p>Nom : {selectedRequest?.company_name}</p>
              <p>SIRET : {selectedRequest?.siret}</p>
              <p>Adresse : {selectedRequest?.address}</p>
            </div>

            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Raison du rejet</h3>
              <p>{selectedRequest?.reason}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}