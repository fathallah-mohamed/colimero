import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface RequestActionsProps {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isSubmitting: boolean;
}

export function RequestActions({ onApprove, onReject, isSubmitting }: RequestActionsProps) {
  return (
    <>
      <Button
        variant="destructive"
        onClick={onReject}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Rejeter
      </Button>
      <Button
        onClick={onApprove}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <Check className="h-4 w-4" />
        Approuver
      </Button>
    </>
  );
}