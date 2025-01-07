import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Profile } from "@/types/profile";
import { ServicesList } from "./services/ServicesList";
import { EditServicesDialog } from "./services/EditServicesDialog";

export interface ServicesSectionProps {
  profile: Profile;
  onUpdate?: () => void;
}

export function ServicesSection({ profile, onUpdate }: ServicesSectionProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Services proposés</h2>
      </div>
      <ServicesList services={profile.carrier_services || []} />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <EditServicesDialog
            profile={profile}
            onClose={() => {
              setShowEditDialog(false);
              onUpdate?.();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}