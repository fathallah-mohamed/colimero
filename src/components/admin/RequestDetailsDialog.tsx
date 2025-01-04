import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RequestHeader } from "./request-details/RequestHeader";
import { PersonalInfo } from "./request-details/PersonalInfo";
import { CompanyInfo } from "./request-details/CompanyInfo";
import { CapacityInfo } from "./request-details/CapacityInfo";
import { RequestActions } from "./request-details/RequestActions";

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
      console.error("Error approving request:", error);
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
      const { error: updateError } = await supabase
        .from("carrier_registration_requests")
        .update({
          status: "rejected",
          reason: rejectionReason,
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

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
        <DialogDescription>
          Examinez les détails de la demande avant de l'approuver ou la rejeter.
        </DialogDescription>
        
        <RequestHeader companyName={request.company_name} />

        <div className="grid grid-cols-2 gap-4 py-4">
          <PersonalInfo
            firstName={request.first_name}
            lastName={request.last_name}
            email={request.email}
            phone={request.phone}
            phoneSecondary={request.phone_secondary}
          />

          <CompanyInfo
            companyName={request.company_name}
            siret={request.siret}
            address={request.address}
          />

          <CapacityInfo
            totalCapacity={request.total_capacity}
            pricePerKg={request.price_per_kg}
            coverageArea={request.coverage_area}
            services={request.services}
          />

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
            <RequestActions
              onApprove={handleApprove}
              onReject={handleReject}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}