import { ProfileData } from "@/types/profile";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { CheckSquare } from "lucide-react";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const CommitmentDisplay = ({ 
    label, 
    description,
    acceptedAt
  }: { 
    label: string;
    description: string;
    acceptedAt?: string;
  }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <CheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
        {acceptedAt && (
          <p className="text-sm text-gray-500">
            Accepté le {new Date(acceptedAt).toLocaleDateString()}
          </p>
        )}
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

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Prénom</p>
              <p className="text-gray-900 font-medium">{profile.first_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nom</p>
              <p className="text-gray-900 font-medium">{profile.last_name || "-"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-gray-900 font-medium">{profile.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Téléphone</p>
            <p className="text-gray-900 font-medium">{profile.phone || "-"}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements acceptés à l'inscription</h2>
        <div className="space-y-4">
          {profile.terms_accepted && (
            <CommitmentDisplay 
              label="Conditions générales"
              description="En acceptant les conditions générales, vous vous êtes engagé à respecter les règles et procédures de notre plateforme pour assurer un service de qualité."
              acceptedAt={profile.terms_accepted_at}
            />
          )}
          {profile.customs_terms_accepted && (
            <CommitmentDisplay 
              label="Conditions douanières"
              description="Vous vous êtes engagé à respecter les réglementations douanières internationales et à gérer les documents nécessaires pour le transport transfrontalier."
              acceptedAt={profile.terms_accepted_at}
            />
          )}
          {profile.responsibility_terms_accepted && (
            <CommitmentDisplay 
              label="Responsabilité des objets transportés"
              description="Vous avez accepté vos responsabilités concernant la sécurité et l'intégrité des objets pendant le transport, incluant la manipulation appropriée et la protection contre les dommages."
              acceptedAt={profile.terms_accepted_at}
            />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations entreprise</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nom de l'entreprise</p>
            <p className="text-gray-900 font-medium">{profile.company_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">SIRET</p>
            <p className="text-gray-900 font-medium">{profile.siret || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Adresse</p>
            <p className="text-gray-900 font-medium">{profile.address || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Zones de couverture</p>
            <p className="text-gray-900 font-medium">
              {profile.coverage_area?.map((code: string) => {
                const country = {
                  FR: "France",
                  TN: "Tunisie",
                  MA: "Maroc",
                  DZ: "Algérie"
                }[code];
                return country;
              }).join(", ") || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Capacité totale</p>
            <p className="text-gray-900 font-medium">{profile.carrier_capacities?.total_capacity || "-"} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Prix par kg</p>
            <p className="text-gray-900 font-medium">{profile.carrier_capacities?.price_per_kg || "-"} €</p>
          </div>
        </div>
      </div>
    </div>
  );
}
