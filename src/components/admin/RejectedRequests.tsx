import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";

export default function RejectedRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleReapprove = async (request: any) => {
    try {
      // 1. Check if carrier exists
      const { data: existingCarrier, error: checkError } = await supabase
        .from("carriers")
        .select("id")
        .eq("email", request.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingCarrier) {
        // If carrier exists, just update their status
        const { error: updateError } = await supabase
          .from("carriers")
          .update({ status: "active" })
          .eq("id", existingCarrier.id);

        if (updateError) throw updateError;
      }

      // 2. Update the request status
      const { error: requestError } = await supabase
        .from("carrier_registration_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (requestError) throw requestError;

      // 3. Refresh the data
      await queryClient.invalidateQueries({ queryKey: ["rejected-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["approved-carriers"] });

      toast({
        title: "Transporteur réapprouvé",
        description: "Le compte du transporteur a été réactivé avec succès.",
      });
    } catch (error: any) {
      console.error("Error reapproving carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réapprouver le transporteur.",
      });
    }
  };

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
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                >
                  Voir les détails
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleReapprove(request)}
                >
                  Réapprouver
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