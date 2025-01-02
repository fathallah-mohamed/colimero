import React from 'react';
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientProfileViewProps {
  profile: any;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  const { data: consents, isLoading: isLoadingConsents } = useQuery({
    queryKey: ['client-consents', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_consents')
        .select(`
          *,
          consent_type:client_consent_types(*)
        `)
        .eq('client_id', profile.id);

      if (error) throw error;
      return data;
    },
  });

  const CommitmentStatus = ({ accepted, acceptedAt, label, description }: { accepted: boolean, acceptedAt?: string, label: string, description: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <div className={`flex items-center ${accepted ? 'text-green-600' : 'text-red-600'} font-medium`}>
          {accepted ? (
            <Check className="w-5 h-5 mr-2 stroke-2" />
          ) : (
            <X className="w-5 h-5 mr-2 stroke-2" />
          )}
          <span>{accepted ? 'Accepté' : 'Non accepté'}</span>
        </div>
      </div>
      {accepted && acceptedAt && (
        <p className="text-sm text-muted-foreground">
          Accepté le {format(new Date(acceptedAt), 'dd MMMM yyyy', { locale: fr })}
        </p>
      )}
      <Alert>
        <AlertDescription className="text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
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
          <div>
            <p className="text-sm text-gray-500 mb-1">Date de naissance</p>
            <p className="text-gray-900 font-medium">
              {profile.birth_date ? format(new Date(profile.birth_date), 'dd MMMM yyyy', { locale: fr }) : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Adresse</p>
            <p className="text-gray-900 font-medium">{profile.address || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Pièce d'identité</p>
            <p className="text-gray-900 font-medium">
              {profile.id_document ? (
                <a 
                  href={profile.id_document} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Voir le document
                </a>
              ) : "-"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements et consentements</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
          {isLoadingConsents ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
          ) : (
            consents?.map((consent) => (
              <div key={consent.id}>
                <CommitmentStatus 
                  accepted={consent.accepted} 
                  acceptedAt={consent.accepted_at}
                  label={consent.consent_type.label}
                  description={consent.consent_type.description}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}