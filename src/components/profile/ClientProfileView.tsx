import React from 'react';
import { Check, X } from "lucide-react";

interface ClientProfileViewProps {
  profile: any;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  const CommitmentStatus = ({ accepted }: { accepted: boolean }) => (
    <span className={`inline-flex items-center ${accepted ? 'text-green-600' : 'text-red-600'}`}>
      {accepted ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
      {accepted ? 'Accepté' : 'Non accepté'}
    </span>
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
        </div>
      </div>
    </div>
  );
}