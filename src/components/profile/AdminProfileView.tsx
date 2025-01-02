import React from 'react';
import { ProfileData } from '@/types/profile';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface AdminProfileViewProps {
  profile: ProfileData;
}

export function AdminProfileView({ profile }: AdminProfileViewProps) {
  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary/70" />
          Informations administrateur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <InfoItem 
            icon={MapPin} 
            label="Adresse" 
            value={profile.address || "-"} 
          />
        </div>
      </div>
    </div>
  );
}