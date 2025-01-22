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

  // Pour les clients, afficher uniquement le bouton d'annulation
  if (userType === 'client' && onCancel) {
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

  return null;
}