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
import { Ban, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ClientDetailsDialog from "./ClientDetailsDialog";

export function ClientsList() {
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
      const { error } = await supabase
        .from("clients")
        .update({ status: "suspended" })
        .eq("id", clientId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["clients"] });

      toast({
        title: "Compte suspendu",
        description: "Le compte du client a été suspendu avec succès.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de suspendre le compte.",
      });
    }
  };

  const filteredClients = clients?.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Chargement...</div>;

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
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{`${client.first_name} ${client.last_name}`}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  client.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedClient(client)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Détails
                </Button>
                {client.status === 'active' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSuspendClient(client.id)}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspendre
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
    </div>
  );
}