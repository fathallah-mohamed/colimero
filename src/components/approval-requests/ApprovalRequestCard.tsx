import React from "react";
import { CollectionPoint } from "./CollectionPoint";
import { RequestHeader } from "./RequestHeader";
import { RequestStatus } from "./RequestStatus";
import { RequestActions } from "./RequestActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApprovalRequestCardProps {
  request: {
    id: string;
    tour: any;
    user: any;
    status: string;
    reason: string;
    pickup_city: string;
  };
  onStatusChange: (status: string) => void;
  userType?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function ApprovalRequestCard({ 
  request, 
  onStatusChange,
  userType,
  onCancel,
  onDelete 
}: ApprovalRequestCardProps) {
  const { toast } = useToast();
  const selectedStop = request.tour?.route?.find(
    (stop: any) => stop.name === request.pickup_city
  );

  const handleApprove = async () => {
    try {
      // Appeler l'edge function pour approuver la demande
      const { data, error } = await supabase.functions.invoke("approve-request", {
        body: { requestId: request.id }
      });

      if (error) throw error;

      toast({
        title: "Demande approuvée",
        description: "Le client peut maintenant se connecter et accéder à la tournée.",
      });

      onStatusChange('approved');
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'approbation.",
      });
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ 
          status: 'rejected',
          reason: 'Demande rejetée par le transporteur'
        })
        .eq('id', request.id);

      if (error) throw error;

      // Envoyer un email de notification
      const { error: emailError } = await supabase.functions.invoke("send-rejection-email", {
        body: {
          email: request.user.email,
          reason: 'Demande rejetée par le transporteur'
        }
      });

      if (emailError) console.error("Error sending rejection email:", emailError);

      toast({
        title: "Demande rejetée",
        description: "Un email a été envoyé au client.",
      });

      onStatusChange('rejected');
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet.",
      });
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-6">
        <RequestHeader 
          tour={request.tour}
          user={request.user}
        />

        {selectedStop && (
          <CollectionPoint selectedStop={selectedStop} />
        )}

        <RequestStatus 
          status={request.status}
          message={request.reason}
        />

        <RequestActions 
          status={request.status}
          userType={userType}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}