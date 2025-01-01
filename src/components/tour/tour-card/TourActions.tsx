import { Button } from "@/components/ui/button";
import { Edit2, Trash2, FileDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TourActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onDownloadPDF: () => void;
  isCompleted?: boolean;
}

export function TourActions({ 
  onEdit, 
  onDelete, 
  onDownloadPDF,
  isCompleted = false 
}: TourActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onDownloadPDF}
        title="Télécharger la liste des réservations"
      >
        <FileDown className="h-4 w-4" />
      </Button>
      {!isCompleted && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la tournée ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les réservations associées seront également supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}