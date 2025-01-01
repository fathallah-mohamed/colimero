import React from 'react';
import { Check, X, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientProfileViewProps {
  profile: any;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  const CommitmentStatus = ({ 
    accepted, 
    label, 
    description 
  }: { 
    accepted: boolean; 
    label: string;
    description: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">{label}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={`flex items-center gap-2 ${accepted ? 'text-green-600' : 'text-red-600'}`}>
            {accepted ? (
              <>
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Accepté</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span className="text-sm font-medium">Non accepté</span>
              </>
            )}
          </div>
        </div>
        {accepted && profile.terms_accepted_at && (
          <span className="text-xs text-gray-500">
            le {new Date(profile.terms_accepted_at).toLocaleDateString()}
          </span>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
          <CommitmentStatus 
            accepted={profile.terms_accepted || false}
            label="Conditions générales"
            description="En acceptant les conditions générales, vous vous engagez à respecter les règles et procédures de notre plateforme pour une expérience optimale."
          />
        </div>
      </div>
    </div>
  );
}