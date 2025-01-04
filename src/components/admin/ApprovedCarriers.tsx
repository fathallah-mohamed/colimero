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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ApprovedCarriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: carriers, isLoading } = useQuery({
    queryKey: ["approved-carriers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuspendCarrier = async (carrierId: string) => {
    try {
      // Mettre à jour le statut du transporteur
      const { error: updateError } = await supabase
        .from("carriers")
        .update({ status: "suspended" })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      // Créer une demande rejetée
      const carrier = carriers?.find(c => c.id === carrierId);
      if (!carrier) throw new Error("Transporteur non trouvé");

      const { error: requestError } = await supabase
        .from("carrier_registration_requests")
        .insert({
          id: carrierId,
          email: carrier.email,
          first_name: carrier.first_name,
          last_name: carrier.last_name,
          company_name: carrier.company_name,
          siret: carrier.siret,
          phone: carrier.phone,
          phone_secondary: carrier.phone_secondary,
          address: carrier.address,
          coverage_area: carrier.coverage_area,
          status: "rejected",
          reason: "Compte suspendu par un administrateur",
          avatar_url: carrier.avatar_url,
        });

      if (requestError) throw requestError;

      // Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ["approved-carriers"] });
      await queryClient.invalidateQueries({ queryKey: ["rejected-requests"] });

      toast({
        title: "Transporteur suspendu",
        description: "Le compte du transporteur a été suspendu avec succès.",
      });
    } catch (error: any) {
      console.error("Error suspending carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de suspendre le transporteur.",
      });
    }
  };

  const filteredCarriers = carriers?.filter(
    (carrier) =>
      carrier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCarriers?.map((carrier) => (
            <TableRow key={carrier.id}>
              <TableCell>{carrier.company_name}</TableCell>
              <TableCell>{carrier.email}</TableCell>
              <TableCell>{carrier.phone}</TableCell>
              <TableCell>
                {format(new Date(carrier.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleSuspendCarrier(carrier.id)}
                >
                  Suspendre
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}