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
import { ActionButton } from "./ActionButton";
import { LucideIcon } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonLabel: string;
  buttonColorClass: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title,
  description,
  icon,
  buttonLabel,
  buttonColorClass,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ActionButton
          icon={icon}
          label={buttonLabel}
          onClick={() => {}}
          colorClass={buttonColorClass}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200">Retour</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}