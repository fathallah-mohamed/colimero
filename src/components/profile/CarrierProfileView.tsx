import { ProfileData } from "@/types/profile";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { Check, X } from "lucide-react";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const CommitmentStatus = ({ accepted }: { accepted: boolean }) => (
    <span className={`inline-flex items-center ${accepted ? 'text-green-600' : 'text-red-600'}`}>
      {accepted ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
      {accepted ? 'Accepté' : 'Non accepté'}
    </span>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Conditions générales</p>
            <CommitmentStatus accepted={profile.terms_accepted || false} />
            {profile.terms_accepted && profile.terms_accepted_at && (
              <p className="text-xs text-gray-500 mt-1">
                Accepté le {new Date(profile.terms_accepted_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Conditions douanières</p>
            <CommitmentStatus accepted={profile.customs_terms_accepted || false} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Responsabilité des objets transportés</p>
            <CommitmentStatus accepted={profile.responsibility_terms_accepted || false} />
          </div>
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