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
import CarrierDetailsDialog from "./CarrierDetailsDialog";

export function CarriersList() {
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
      const { error } = await supabase
        .from("carriers")
        .update({ status: "suspended" })
        .eq("id", carrierId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["carriers"] });

      toast({
        title: "Compte suspendu",
        description: "Le compte du transporteur a été suspendu avec succès.",
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

  const filteredCarriers = carriers?.filter(
    (carrier) =>
      carrier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Entreprise</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCarriers?.map((carrier) => (
            <TableRow key={carrier.id}>
              <TableCell>{carrier.company_name}</TableCell>
              <TableCell>{carrier.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  carrier.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {carrier.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCarrier(carrier)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Détails
                </Button>
                {carrier.status === 'active' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSuspendCarrier(carrier.id)}
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

      <CarrierDetailsDialog
        carrier={selectedCarrier}
        onClose={() => setSelectedCarrier(null)}
      />
    </div>
  );
}