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

export default function ApprovedCarriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
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
      // 1. First update the carrier status
      const { error: updateError } = await supabase
        .from("carriers")
        .update({ status: "suspended" })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      // 2. Get the carrier details
      const { data: carrier, error: carrierError } = await supabase
        .from("carriers")
        .select("*")
        .eq("id", carrierId)
        .single();

      if (carrierError) throw carrierError;

      // 3. Check if a rejected request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from("carrier_registration_requests")
        .select("id")
        .eq("email", carrier.email)
        .eq("status", "rejected")
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (!existingRequest) {
        // 4. Only create a new rejected request if one doesn't exist
        const { error: requestError } = await supabase
          .from("carrier_registration_requests")
          .insert([{
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
          }]);

        if (requestError) throw requestError;
      }

      // 5. Refresh the data
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
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCarrier(carrier)}
                >
                  Voir les détails
                </Button>
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