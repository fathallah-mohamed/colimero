import { ProfileData } from "@/types/profile";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CarrierProfileViewProps {
  profile: ProfileData;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const CommitmentStatus = ({ accepted, description }: { accepted: boolean, description: string }) => (
    <div className="space-y-2">
      <div className={`flex items-center ${accepted ? 'text-green-600' : 'text-red-600'}`}>
        {accepted ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
        <span>{accepted ? 'Accepté' : 'Non accepté'}</span>
      </div>
      <Alert>
        <AlertDescription className="text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
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

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-2">Conditions générales</p>
            <CommitmentStatus 
              accepted={!!profile.terms_accepted} 
              description="Je certifie que toutes les informations fournies sont exactes et je m'engage à respecter les conditions générales d'utilisation de la plateforme."
            />
            {profile.terms_accepted && profile.terms_accepted_at && (
              <p className="text-xs text-gray-500 mt-1">
                Accepté le {new Date(profile.terms_accepted_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Conditions douanières</p>
            <CommitmentStatus 
              accepted={!!profile.customs_terms_accepted}
              description="Je m'engage à respecter toutes les réglementations douanières en vigueur et à déclarer correctement tous les colis transportés lors des passages aux frontières."
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Responsabilité des objets transportés</p>
            <CommitmentStatus 
              accepted={!!profile.responsibility_terms_accepted}
              description="Je reconnais être entièrement responsable des objets transportés pendant toute la durée de leur prise en charge, de leur collecte jusqu'à leur livraison."
            />
          </div>
        </div>
      </div>
    </div>
  );
}