import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogHeaderProps {
  title: string;
  onClose: () => void;
}

const DialogHeader = ({ title, onClose }: DialogHeaderProps) => (
  <BaseDialogHeader className="relative pb-2">
    <DialogTitle>{title}</DialogTitle>
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-10 w-10 transition-transform hover:scale-110 hover:text-primary"
      onClick={onClose}
      aria-label="Fermer"
    >
      <X className="h-6 w-6" />
    </Button>
  </BaseDialogHeader>
);

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomDialog({
  open,
  onClose,
  title,
  children,
  className,
}: CustomDialogProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const initialFocusRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} modal={true}>
      <DialogContent
        className={className}
        onInteractOutside={(e) => {
          e.preventDefault(); // Empêche la fermeture au clic extérieur
        }}
      >
        <DialogHeader title={title} onClose={onClose} />
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return child;
          }

          if (!child.type) {
            return child;
          }

          const isRefableComponent = 
            typeof child.type === 'string' || 
            (typeof child.type === 'function' && ('render' in child.type || (child.type as any).prototype?.render)) ||
            (typeof child.type === 'object' && child.type && 'render' in child.type);

          if (isRefableComponent) {
            return React.cloneElement(child, {
              ...child.props,
              ref: initialFocusRef
            });
          }

          return child;
        })}
      </DialogContent>
    </Dialog>
  );
}