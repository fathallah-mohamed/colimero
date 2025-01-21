import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RequestActionsProps {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isSubmitting: boolean;
  showRejectButton: boolean;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
}

export function RequestActions({
  onApprove,
  onReject,
  isSubmitting,
  showRejectButton,
  rejectReason,
  onRejectReasonChange,
}: RequestActionsProps) {
  return (
    <div className="space-y-4">
      {showRejectButton && (
        <div className="space-y-2">
          <Textarea
            placeholder="Raison du rejet..."
            value={rejectReason}
            onChange={(e) => onRejectReasonChange(e.target.value)}
          />
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isSubmitting}
            className="w-full"
          >
            Rejeter
          </Button>
        </div>
      )}
      <Button
        onClick={onApprove}
        disabled={isSubmitting}
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
      >
        Approuver
      </Button>
    </div>
  );
}