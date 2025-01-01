import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileData } from "@/types/profile";

interface CommitmentStatusProps {
  accepted: boolean;
  description: string;
}

const CommitmentStatus = ({ accepted, description }: CommitmentStatusProps) => (
  <div className="space-y-2">
    <div className={`flex items-center ${accepted ? 'text-green-600' : 'text-red-600'} font-medium`}>
      {accepted ? (
        <Check className="w-5 h-5 mr-2 stroke-2" />
      ) : (
        <X className="w-5 h-5 mr-2 stroke-2" />
      )}
      <span>{accepted ? 'Accepté' : 'Non accepté'}</span>
    </div>
    <Alert>
      <AlertDescription className="text-sm text-muted-foreground">
        {description}
      </AlertDescription>
    </Alert>
  </div>
);

interface CommitmentsSectionProps {
  profile: ProfileData;
}

export function CommitmentsSection({ profile }: CommitmentsSectionProps) {
  console.log("Profile data for commitments:", profile);
  
  // Conversion stricte en booléen en vérifiant si la valeur est strictement true
  const termsAccepted = profile.terms_accepted === true;
  const customsTermsAccepted = profile.customs_terms_accepted === true;
  const responsibilityTermsAccepted = profile.responsibility_terms_accepted === true;

  console.log("Commitment values after conversion:", {
    termsAccepted,
    customsTermsAccepted,
    responsibilityTermsAccepted,
    rawValues: {
      terms: profile.terms_accepted,
      customs: profile.customs_terms_accepted,
      responsibility: profile.responsibility_terms_accepted
    }
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements</h2>
      <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
        <div>
          <p className="text-sm text-gray-500 mb-2">Conditions générales</p>
          <CommitmentStatus 
            accepted={termsAccepted}
            description="Je certifie que toutes les informations fournies sont exactes et je m'engage à respecter les conditions générales d'utilisation de la plateforme."
          />
          {termsAccepted && profile.terms_accepted_at && (
            <p className="text-xs text-gray-500 mt-1">
              Accepté le {new Date(profile.terms_accepted_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Conditions douanières</p>
          <CommitmentStatus 
            accepted={customsTermsAccepted}
            description="Je m'engage à respecter toutes les réglementations douanières en vigueur et à déclarer correctement tous les colis transportés lors des passages aux frontières."
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Responsabilité des objets transportés</p>
          <CommitmentStatus 
            accepted={responsibilityTermsAccepted}
            description="Je reconnais être entièrement responsable des objets transportés pendant toute la durée de leur prise en charge, de leur collecte jusqu'à leur livraison."
          />
        </div>
      </div>
    </div>
  );
}