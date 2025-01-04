import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";

interface RequestDetailsDialogProps {
  request: any;
  onClose: () => void;
}

export default function RequestDetailsDialog({ request, onClose }: RequestDetailsDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Mettre à jour le statut de la demande
      const { error: updateError } = await supabase
        .from("carrier_registration_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Créer le profil transporteur
      const { error: carrierError } = await supabase
        .from("carriers")
        .insert([{
          id: request.id,
          email: request.email,
          first_name: request.first_name,
          last_name: request.last_name,
          phone: request.phone,
          company_name: request.company_name,
          siret: request.siret,
          address: request.address,
          coverage_area: request.coverage_area,
          avatar_url: request.avatar_url || '',
          phone_secondary: request.phone_secondary || '',
          status: 'active'
        }]);

      if (carrierError) throw carrierError;

      // Envoyer l'email de confirmation via l'edge function
      const response = await fetch("/api/send-approval-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: request.email,
          company_name: request.company_name,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }

      toast({
        title: "Demande approuvée",
        description: "Un email a été envoyé au transporteur.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez indiquer la raison du rejet.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Mettre à jour le statut de la demande
      const { error: updateError } = await supabase
        .from("carrier_registration_requests")
        .update({
          status: "rejected",
          reason: rejectionReason,
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Envoyer l'email de rejet via l'edge function
      const { data, error } = await supabase.functions.invoke("send-rejection-email", {
        body: JSON.stringify({
          email: request.email,
          company_name: request.company_name,
          reason: rejectionReason,
        }),
      });

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "Un email a été envoyé au transporteur.",
      });
      onClose();
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la demande - {request.company_name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Informations personnelles</h3>
            <p>Prénom : {request.first_name}</p>
            <p>Nom : {request.last_name}</p>
            <p>Email : {request.email}</p>
            <p>Téléphone : {request.phone}</p>
            {request.phone_secondary && (
              <p>Téléphone secondaire : {request.phone_secondary}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informations entreprise</h3>
            <p>Nom : {request.company_name}</p>
            <p>SIRET : {request.siret}</p>
            <p>Adresse : {request.address}</p>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Capacités</h3>
            <p>Capacité totale : {request.total_capacity} kg</p>
            <p>Prix par kg : {request.price_per_kg} €</p>
            <p>Zone de couverture : {request.coverage_area?.join(", ")}</p>
            <p>Services : {request.services?.join(", ")}</p>
          </div>

          {request.status === "pending" && (
            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Raison du rejet (si refusé)</h3>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Expliquez la raison du rejet..."
                className="mb-4"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {request.status === "pending" && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Rejeter
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Approuver
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
