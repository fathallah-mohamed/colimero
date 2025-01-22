import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierProfileForm } from "./CarrierProfileForm";
import { ProfileHeader } from "../ProfileHeader";
import { Profile } from "@/types/profile";
import { Mail, Phone, MapPin, Building2, FileText } from "lucide-react";
import { ServicesSection } from "../services/ServicesList";
import { PasswordChangeSection } from "../PasswordChangeSection";

interface CarrierProfileViewProps {
  profile: Profile;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-primary/70 mt-1" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value || "Non renseigné"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <ProfileHeader
        title="Profil Transporteur"
        description="Gérez vos informations personnelles et professionnelles"
        onEdit={() => setShowEditDialog(true)}
      />

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem 
            icon={Building2} 
            label="Entreprise" 
            value={profile.company_name} 
          />
          <InfoItem 
            icon={FileText} 
            label="SIRET" 
            value={profile.siret} 
          />
          <InfoItem 
            icon={Mail} 
            label="Email" 
            value={profile.email} 
          />
          <InfoItem 
            icon={Phone} 
            label="Téléphone" 
            value={profile.phone} 
          />
          <InfoItem 
            icon={MapPin} 
            label="Adresse" 
            value={profile.address} 
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <PasswordChangeSection />
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