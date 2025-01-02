import { ProfileData } from "@/types/profile";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { CommitmentsSection } from "./CommitmentsSection";
import { ServicesSection } from "./ServicesSection";
import { Building2, Mail, MapPin, Phone, User, Wallet, Weight, Euro } from "lucide-react";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-primary/70" />
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <TransporteurAvatar
          avatarUrl={profile.avatar_url}
          name={profile.company_name || `${profile.first_name} ${profile.last_name}`}
          size="xl"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {profile.company_name || `${profile.first_name} ${profile.last_name}`}
          </h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section Informations personnelles */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary/70" />
            Informations personnelles
          </h2>
          <div className="space-y-4">
            <InfoItem 
              icon={User} 
              label="Prénom" 
              value={profile.first_name || "-"} 
            />
            <InfoItem 
              icon={User} 
              label="Nom" 
              value={profile.last_name || "-"} 
            />
            <InfoItem 
              icon={Mail} 
              label="Email" 
              value={profile.email || "-"} 
            />
            <InfoItem 
              icon={Phone} 
              label="Téléphone" 
              value={profile.phone || "-"} 
            />
          </div>
        </div>

        {/* Section Informations entreprise */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary/70" />
            Informations entreprise
          </h2>
          <div className="space-y-4">
            <InfoItem 
              icon={Building2} 
              label="Nom de l'entreprise" 
              value={profile.company_name || "-"} 
            />
            <InfoItem 
              icon={Wallet} 
              label="SIRET" 
              value={profile.siret || "-"} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Adresse" 
              value={profile.address || "-"} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Zones de couverture" 
              value={profile.coverage_area?.map((code: string) => {
                const country = {
                  FR: "France",
                  TN: "Tunisie",
                  MA: "Maroc",
                  DZ: "Algérie"
                }[code];
                return country;
              }).join(", ") || "-"} 
            />
          </div>
        </div>
      </div>

      {/* Section Capacités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem 
          icon={Weight} 
          label="Capacité totale" 
          value={`${profile.carrier_capacities?.total_capacity || "-"} kg`} 
        />
        <InfoItem 
          icon={Euro} 
          label="Prix par kg" 
          value={`${profile.carrier_capacities?.price_per_kg || "-"} €`} 
        />
      </div>

      {/* Section Services */}
      <ServicesSection profile={profile} onUpdate={() => window.location.reload()} />

      <CommitmentsSection profile={profile} />
    </div>
  );
}