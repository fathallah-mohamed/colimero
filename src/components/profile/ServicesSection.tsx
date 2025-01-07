import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditServicesDialog } from "./services/EditServicesDialog";
import { ServicesList } from "./services/ServicesList";
import { ServicesSectionProps } from "@/types/profile";

export function ServicesSection({ profile, onUpdate }: ServicesSectionProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Services proposés</h2>
      </div>
      <ServicesList services={profile.carrier_services || []} />

      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <EditServicesDialog
              carrier_id={profile.id}
              onClose={() => {
                setShowEditDialog(false);
                onUpdate?.();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}