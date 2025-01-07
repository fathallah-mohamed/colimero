import { useState } from "react";
import { ProfileData } from "@/types/profile";
import { ServicesSection } from "./ServicesSection";
import { CommitmentsSection } from "./CommitmentsSection";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = () => {
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Mon profil</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informations personnelles</h3>
          <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Nom</span>
              <p className="text-gray-900">{profile.last_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Prénom</span>
              <p className="text-gray-900">{profile.first_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Téléphone</span>
              <p className="text-gray-900">{profile.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informations entreprise</h3>
          <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Nom de l'entreprise</span>
              <p className="text-gray-900">{profile.company_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">SIRET</span>
              <p className="text-gray-900">{profile.siret}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Adresse</span>
              <p className="text-gray-900">{profile.address}</p>
            </div>
          </div>
        </div>
      </div>

      <ServicesSection profile={profile} onUpdate={() => window.location.reload()} />
      <CommitmentsSection profile={profile} />

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
          </DialogHeader>
          <ProfileForm 
            initialData={profile} 
            onClose={handleProfileUpdate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}