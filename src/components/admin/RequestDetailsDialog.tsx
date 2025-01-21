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
import { approveCarrierRequest } from "@/services/carrier-approval";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ApprovalRequest } from "./approval-requests/types";

interface RequestDetailsDialogProps {
  request: ApprovalRequest | null;
  onClose: () => void;
  onApprove?: (request: ApprovalRequest) => void;
  onReject?: (request: ApprovalRequest) => void;
  showApproveButton?: boolean;
}

export const RequestDetailsDialog = ({ 
  request, 
  onClose,
  onApprove,
  onReject,
  showApproveButton = false,
}: RequestDetailsDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    if (onApprove) {
      onApprove(request);
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await approveCarrierRequest(request.id);

      // Supprimer la demande d'inscription après approbation
      const { error: deleteError } = await supabase
        .from('carrier_registration_requests')
        .delete()
        .eq('id', request.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Demande approuvée",
        description: "Le transporteur a été approuvé avec succès et peut maintenant se connecter.",
        duration: 5000,
      });

      // Invalider les requêtes pour forcer un rafraîchissement des données
      await queryClient.invalidateQueries({ queryKey: ["carrier-requests"] });
      
      onClose();
      
      // Rediriger vers l'onglet des transporteurs validés
      navigate('/admin/dashboard?tab=approved');
      
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation de la demande.",
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
          email: request.client.email,
          company_name: request.tour.carrier.company_name,
          reason: rejectionReason,
        }),
      });

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "Un email a été envoyé au transporteur.",
      });
      
      // Invalider les requêtes pour forcer un rafraîchissement des données
      await queryClient.invalidateQueries({ queryKey: ["carrier-requests"] });
      
      onClose();
      
      // Rediriger vers l'onglet des demandes rejetées
      navigate('/admin/dashboard?tab=rejected');
      
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet de la demande.",
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
        
        <RequestHeader companyName={request.tour.carrier.company_name} />

        <div className="grid grid-cols-2 gap-4 py-4">
          <PersonalInfo
            firstName={request.client.first_name}
            lastName={request.client.last_name}
            email={request.client.email}
            phone={request.client.phone}
            phoneSecondary={request.client.phone_secondary}
            address={request.client.address}
            emailVerified={request.client.email_verified}
            createdAt={request.client.created_at}
          />

          <CompanyInfo
            companyName={request.tour.carrier.company_name}
            siret={request.tour.carrier.siret}
            address={request.tour.carrier.address}
          />

          <CapacityInfo
            totalCapacity={request.tour.total_capacity}
            pricePerKg={request.tour.carrier.price_per_kg}
            coverageArea={request.tour.carrier.coverage_area}
            services={request.tour.carrier.services}
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
          {(request.status === "pending" || showApproveButton) && (
            <RequestActions
              onApprove={handleApprove}
              onReject={handleReject}
              isSubmitting={isSubmitting}
              showRejectButton={request.status === "pending"}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};