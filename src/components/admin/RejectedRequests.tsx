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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { RefreshCw, Search, UserPlus, XSquare } from "lucide-react";

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
      const { data: existingCarrier, error: checkError } = await supabase
        .from("carriers")
        .select("id")
        .eq("email", request.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingCarrier) {
        const { error: updateError } = await supabase
          .from("carriers")
          .update({ status: "active" })
          .eq("id", existingCarrier.id);

        if (updateError) throw updateError;
      }

      const { error: requestError } = await supabase
        .from("carrier_registration_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (requestError) throw requestError;

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
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="hidden md:block">
        <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
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
                  <TableCell className="font-medium">{request.company_name}</TableCell>
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
                      className="inline-flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Détails
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleReapprove(request)}
                      className="inline-flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Réapprouver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRequests?.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="space-y-2">
              <div className="font-medium">{request.company_name}</div>
              <div className="text-sm text-gray-500">{request.email}</div>
              <div className="text-sm">{request.phone}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(request.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                  className="w-full inline-flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Voir les détails
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleReapprove(request)}
                  className="w-full inline-flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Réapprouver
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XSquare className="h-5 w-5 text-destructive" />
              Détails de la demande rejetée - {selectedRequest?.company_name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informations personnelles</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Prénom :</span> {selectedRequest?.first_name}</p>
                <p><span className="font-medium">Nom :</span> {selectedRequest?.last_name}</p>
                <p><span className="font-medium">Email :</span> {selectedRequest?.email}</p>
                <p><span className="font-medium">Téléphone :</span> {selectedRequest?.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informations entreprise</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nom :</span> {selectedRequest?.company_name}</p>
                <p><span className="font-medium">SIRET :</span> {selectedRequest?.siret}</p>
                <p><span className="font-medium">Adresse :</span> {selectedRequest?.address}</p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="font-semibold text-lg text-destructive">Raison du rejet</h3>
              <p className="p-4 bg-destructive/10 rounded-lg text-destructive">
                {selectedRequest?.reason}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}