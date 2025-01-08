import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierProfileForm } from "./CarrierProfileForm";
import { ProfileHeader } from "../ProfileHeader";
import { ServicesSection } from "../ServicesSection";
import { CommitmentsSection } from "../CommitmentsSection";
import { Profile } from "@/types/profile";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";

interface CarrierProfileViewProps {
  profile: Profile;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="space-y-6">
      <TransporteurHeader
        name={profile.company_name || ""}
        coverageArea={profile.coverage_area?.join(", ") || ""}
        avatarUrl={profile.avatar_url}
        firstName={profile.first_name}
      />

      <div className="max-w-7xl mx-auto px-4">
        <ProfileHeader
          title="Profil Transporteur"
          description="Gérez vos informations personnelles et professionnelles"
          onEdit={() => setShowEditDialog(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Entreprise</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile.company_name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">SIRET</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile.siret}</p>
                </div>

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
                  <h3 className="text-sm font-medium text-gray-500">Téléphone principal</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone secondaire</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile.phone_secondary || "Non renseigné"}</p>
                </div>

                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                  <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
                </div>
              </div>
            </div>

            <ServicesSection profile={profile} />
          </div>

          <div className="space-y-6">
            <CommitmentsSection profile={profile} />
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <CarrierProfileForm
            initialData={profile}
            onClose={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}