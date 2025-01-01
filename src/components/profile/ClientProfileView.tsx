import React from 'react';
import { CheckSquare } from "lucide-react";

interface ClientProfileViewProps {
  profile: any;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
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
              description="En acceptant les conditions générales, vous vous êtes engagé à respecter les règles de la plateforme, notamment concernant le contenu des colis et les procédures d'expédition."
              acceptedAt={profile.terms_accepted_at}
            />
          )}
        </div>
      </div>
    </div>
  );
}