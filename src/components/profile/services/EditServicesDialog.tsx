import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditServicesDialogProps } from "@/types/profile";

export function EditServicesDialog({ carrier_id, onClose }: EditServicesDialogProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les services</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Sélectionnez les services que vous souhaitez proposer à vos clients.
          </p>
          {/* Service selection form would go here */}
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Transport standard</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Transport express</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Transport frigorifique</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}