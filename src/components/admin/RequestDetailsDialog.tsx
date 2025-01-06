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
  onApprove?: (request: any) => void;
  showApproveButton?: boolean;
}

export default function RequestDetailsDialog({ 
  request, 
  onClose,
  onApprove,
  showApproveButton = false
}: RequestDetailsDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (onApprove) {
      onApprove(request);
      return;
    }

    setIsSubmitting(true);
    try {
      // First verify if auth user exists
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(request.id);
      
      if (authError) {
        console.error("Error checking auth user:", authError);
        // If user doesn't exist, we proceed with the approval which will trigger user creation
      }

      // Update request status
      const { error: updateError } = await supabase
        .from("carrier_registration_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (updateError) {
        console.error("Error updating request:", updateError);
        throw updateError;
      }

      // Wait for triggers to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // First verify auth user was created
      const { data: verifyAuthUser, error: verifyAuthError } = await supabase.auth.admin.getUserById(request.id);
      
      if (verifyAuthError || !verifyAuthUser) {
        throw new Error("Auth user was not created successfully");
      }

      // Then verify carrier was created
      const { data: carrier, error: verifyError } = await supabase
        .from("carriers")
        .select("*")
        .eq("id", request.id)
        .maybeSingle();

      if (verifyError) {
        console.error("Error verifying carrier creation:", verifyError);
        throw verifyError;
      }

      if (!carrier) {
        throw new Error("Carrier was not created successfully");
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
}