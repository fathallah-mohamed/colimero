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

export default function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuspendClient = async (clientId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("clients")
        .update({ status: "suspended" })
        .eq("id", clientId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["clients"] });

      toast({
        title: "Client suspendu",
        description: "Le compte du client a été suspendu avec succès.",
      });
    } catch (error: any) {
      console.error("Error suspending client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de suspendre le client.",
      });
    }
  };

  const handleReactivateClient = async (clientId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("clients")
        .update({ status: "active" })
        .eq("id", clientId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["clients"] });

      toast({
        title: "Client réactivé",
        description: "Le compte du client a été réactivé avec succès.",
      });
    } catch (error: any) {
      console.error("Error reactivating client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réactiver le client.",
      });
    }
  };

  const filteredClients = clients?.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.last_name}</TableCell>
              <TableCell>{client.first_name}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.status || 'active'}</TableCell>
              <TableCell>
                {format(new Date(client.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(client)}
                >
                  Voir les détails
                </Button>
                {(!client.status || client.status === 'active') ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleSuspendClient(client.id)}
                  >
                    Suspendre
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleReactivateClient(client.id)}
                  >
                    Réactiver
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails du client - {selectedClient?.first_name} {selectedClient?.last_name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Informations personnelles</h3>
              <p>Prénom : {selectedClient?.first_name}</p>
              <p>Nom : {selectedClient?.last_name}</p>
              <p>Téléphone : {selectedClient?.phone}</p>
              <p>Date de naissance : {selectedClient?.birth_date}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informations complémentaires</h3>
              <p>Adresse : {selectedClient?.address}</p>
              <p>Email vérifié : {selectedClient?.email_verified ? 'Oui' : 'Non'}</p>
              <p>CGU acceptées : {selectedClient?.terms_accepted ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}