import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = "default"
}: ModalDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "text-red-600";
      case "success":
        return "text-green-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={getVariantStyles()}>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}