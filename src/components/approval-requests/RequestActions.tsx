import { Button } from "@/components/ui/button";

interface RequestActionsProps {
  status: string;
  userType: string | null | undefined;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function RequestActions({ 
  status, 
  userType, 
  onApprove, 
  onReject, 
  onCancel,
  onDelete
}: RequestActionsProps) {
  // Pour les demandes annulées, montrer uniquement le bouton de suppression
  if (status === 'cancelled' && onDelete) {
    return (
      <Button
        variant="destructive"
        onClick={onDelete}
        className="w-full"
      >
        Supprimer la demande
      </Button>
    );
  }

  // Ne pas afficher d'actions pour les demandes qui ne sont pas en attente
  if (status !== 'pending') return null;

  // Afficher les actions appropriées selon le type d'utilisateur
  if (userType === 'carrier') {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onReject}
          className="text-red-600 hover:text-red-700 flex-1"
        >
          Rejeter
        </Button>
        <Button 
          onClick={onApprove}
          className="bg-[#00B0F0] hover:bg-[#0082b3] text-white flex-1"
        >
          Approuver
        </Button>
      </div>
    );
  }

  // Pour les clients, afficher uniquement le bouton d'annulation
  return (
    <Button
      variant="outline"
      onClick={onCancel}
      className="text-red-600 hover:text-red-700 w-full"
    >
      Annuler la demande
    </Button>
  );
}