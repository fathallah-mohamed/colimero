import React, { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { User, Mail, Phone, MapPin, Calendar, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NewRegistrationRequests from '@/components/admin/NewRegistrationRequests';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminProfileForm } from './form/AdminProfileForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

interface AdminProfileViewProps {
  profile: ProfileData;
}

export function AdminProfileView({ profile }: AdminProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-primary/70" />
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium break-words">{value || "-"}</p>
      </div>
    </div>
  );

  const formattedDate = profile.created_at 
    ? format(new Date(profile.created_at), 'PPP', { locale: fr })
    : '-';

  return (
    <div className="space-y-8 pt-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary/70" />
            Informations administrateur
          </h2>
          <div className="flex gap-2">
            <Button onClick={() => setIsChangingPassword(true)} variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Changer le mot de passe
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              Modifier le profil
            </Button>
          </div>
        </div>
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
          <InfoItem 
            icon={Calendar} 
            label="Membre depuis" 
            value={formattedDate} 
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Demandes d'inscription des transporteurs
        </h2>
        <NewRegistrationRequests />
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <AdminProfileForm 
            initialData={profile} 
            onClose={() => setIsEditing(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
          </DialogHeader>
          <ForgotPasswordForm 
            onSuccess={() => setIsChangingPassword(false)}
            onCancel={() => setIsChangingPassword(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}