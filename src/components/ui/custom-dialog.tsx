import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseConfirmation?: boolean;
  title?: string;
}

export function CustomDialog({
  open,
  onClose,
  children,
  className,
  showCloseConfirmation = false,
  title,
}: CustomDialogProps) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const firstInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleClose = () => {
    if (showCloseConfirmation) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleClose()} modal>
        <DialogContent
          className={cn(
            "data-[state=open]:animate-contentShow max-h-[90vh] overflow-y-auto",
            className
          )}
          onOpenAutoFocus={(e) => {
            e.preventDefault(); // Prevent default focus behavior
          }}
        >
          <div className="flex justify-between items-center mb-6">
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </DialogClose>
          </div>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && typeof child.type !== 'string') {
              return React.cloneElement(child, {
                ref: firstInputRef
              });
            }
            return child;
          })}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les informations saisies seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Continuer la saisie
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>
              Quitter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}