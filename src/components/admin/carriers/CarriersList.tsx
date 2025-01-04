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

export default function CarriersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: carriers, isLoading } = useQuery({
    queryKey: ["carriers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuspendCarrier = async (carrierId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("carriers")
        .update({ status: "suspended" })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["carriers"] });

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

  const handleReactivateCarrier = async (carrierId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("carriers")
        .update({ status: "active" })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["carriers"] });

      toast({
        title: "Transporteur réactivé",
        description: "Le compte du transporteur a été réactivé avec succès.",
      });
    } catch (error: any) {
      console.error("Error reactivating carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réactiver le transporteur.",
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
            <TableHead>Statut</TableHead>
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
              <TableCell>{carrier.status}</TableCell>
              <TableCell>
                {format(new Date(carrier.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCarrier(carrier)}
                >
                  Voir les détails
                </Button>
                {carrier.status === 'active' ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleSuspendCarrier(carrier.id)}
                  >
                    Suspendre
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleReactivateCarrier(carrier.id)}
                  >
                    Réactiver
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedCarrier} onOpenChange={() => setSelectedCarrier(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails du transporteur - {selectedCarrier?.company_name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Informations personnelles</h3>
              <p>Prénom : {selectedCarrier?.first_name}</p>
              <p>Nom : {selectedCarrier?.last_name}</p>
              <p>Email : {selectedCarrier?.email}</p>
              <p>Téléphone : {selectedCarrier?.phone}</p>
              {selectedCarrier?.phone_secondary && (
                <p>Téléphone secondaire : {selectedCarrier?.phone_secondary}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informations entreprise</h3>
              <p>Nom : {selectedCarrier?.company_name}</p>
              <p>SIRET : {selectedCarrier?.siret}</p>
              <p>Adresse : {selectedCarrier?.address}</p>
            </div>

            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Zone de couverture</h3>
              <p>{selectedCarrier?.coverage_area?.join(", ")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}