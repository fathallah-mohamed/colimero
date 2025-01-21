import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequest } from "./types";

export function useApprovalAction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async (request: ApprovalRequest): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("approval_requests")
        .update({ 
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Demande approuvée",
        description: "La demande a été approuvée avec succès",
      });
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (request: ApprovalRequest, reason?: string): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("approval_requests")
        .update({ 
          status: "rejected",
          reason,
          updated_at: new Date().toISOString()
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès",
      });
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleApprove,
    handleReject
  };
}