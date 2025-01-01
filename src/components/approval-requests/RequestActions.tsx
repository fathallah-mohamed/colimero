import { Button } from "@/components/ui/button";

interface RequestActionsProps {
  status: string;
  userType: string | null;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

export function RequestActions({ status, userType, onApprove, onReject, onCancel }: RequestActionsProps) {
  if (status !== 'pending') return null;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex gap-2">
      {userType === 'carrier' ? (
        <>
          <Button
            variant="outline"
            onClick={onReject}
            className="text-red-600 hover:text-red-700"
          >
            Rejeter
          </Button>
          <Button onClick={onApprove}>
            Approuver
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={handleCancel}
          className="text-red-600 hover:text-red-700"
        >
          Annuler la demande
        </Button>
      )}
    </div>
  );
}