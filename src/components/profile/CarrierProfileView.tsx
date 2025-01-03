import { ProfileData } from "@/types/profile";
import { ServicesSection } from "./ServicesSection";
import { CommitmentsSection } from "./CommitmentsSection";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  return (
    <div className="space-y-8">
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

      <ServicesSection profile={profile} />
      <CommitmentsSection profile={profile} />
    </div>
  );
}