import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestActions } from "./request-details/RequestActions";
import { RequestHeader } from "./request-details/RequestHeader";
import { PersonalInfo } from "./request-details/PersonalInfo";
import { CompanyInfo } from "./request-details/CompanyInfo";
import { CapacityInfo } from "./request-details/CapacityInfo";
import { useApprovalAction } from "@/hooks/approval-requests/useApprovalAction";
import { CarrierRegistrationRequest } from "./approval-requests/types";

interface RequestDetailsDialogProps {
  request: CarrierRegistrationRequest | null;
  onClose: () => void;
  onApprove: (request: CarrierRegistrationRequest) => Promise<void>;
  onReject: (request: CarrierRegistrationRequest) => Promise<void>;
  showApproveButton?: boolean;
}

export function RequestDetailsDialog({
  request,
  onClose,
  onApprove,
  onReject,
  showApproveButton = false,
}: RequestDetailsDialogProps) {
  const [rejectReason, setRejectReason] = useState("");
  const { isSubmitting, handleApprove, handleReject } = useApprovalAction();

  const handleApproveClick = async () => {
    if (!request) return;
    try {
      await handleApprove(request);
      await onApprove(request);
      onClose();
    } catch (error) {
      console.error("Error in handleApproveClick:", error);
    }
  };

  const handleRejectClick = async () => {
    if (!request) return;
    try {
      await handleReject(request, rejectReason);
      await onReject(request);
      onClose();
    } catch (error) {
      console.error("Error in handleRejectClick:", error);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de la demande</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <RequestHeader request={request} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <PersonalInfo request={request} />
            <CompanyInfo request={request} />
          </div>

          <CapacityInfo request={request} />
        </div>

        <DialogFooter>
          {(request.status === "pending" || showApproveButton) && (
            <RequestActions
              onApprove={handleApproveClick}
              onReject={handleRejectClick}
              isSubmitting={isSubmitting}
              showRejectButton={request.status === "pending"}
              rejectReason={rejectReason}
              onRejectReasonChange={setRejectReason}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}