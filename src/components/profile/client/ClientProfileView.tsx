import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClientProfileForm } from "./ClientProfileForm";
import { ProfileHeader } from "../ProfileHeader";
import { Profile } from "@/types/profile";

interface ClientProfileViewProps {
  profile: Profile;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="space-y-6">
      <ProfileHeader
        title="Profil Client"
        description="Gérez vos informations personnelles"
        onEdit={() => setShowEditDialog(true)}
      />

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
            <p className="mt-1 text-sm text-gray-900">
              {profile.first_name} {profile.last_name}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.phone || "Non renseigné"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
            <p className="mt-1 text-sm text-gray-900">{profile.address || "Non renseignée"}</p>
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <ClientProfileForm
            initialData={profile}
            onClose={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}