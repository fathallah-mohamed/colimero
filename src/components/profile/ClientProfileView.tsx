import React, { useState } from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Upload, Mail, Phone, MapPin, Calendar, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientProfileForm } from "./ClientProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

interface ClientProfileViewProps {
  profile: any;
}

export function ClientProfileView({ profile }: ClientProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

  const handleIdDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('clients')
        .update({ id_document: filePath })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Document d'identité mis à jour avec succès",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-primary/70 mt-1" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mon profil</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsChangingPassword(true)} variant="outline">
            <Lock className="h-4 w-4 mr-2" />
            Changer le mot de passe
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            Modifier mon profil
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem 
            icon={User} 
            label="Nom complet" 
            value={`${profile.first_name || ''} ${profile.last_name || ''}`} 
          />
          <InfoItem 
            icon={Mail} 
            label="Email" 
            value={profile.email} 
          />
          <InfoItem 
            icon={Phone} 
            label="Téléphone" 
            value={profile.phone} 
          />
          <InfoItem 
            icon={MapPin} 
            label="Adresse" 
            value={profile.address} 
          />
          <InfoItem 
            icon={Calendar} 
            label="Date de naissance" 
            value={profile.birth_date ? format(new Date(profile.birth_date), 'dd MMMM yyyy', { locale: fr }) : null} 
          />
          <InfoItem 
            icon={Calendar} 
            label="Membre depuis" 
            value={profile.created_at ? format(new Date(profile.created_at), 'PPP', { locale: fr }) : null} 
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Pièce d'identité</h3>
          <div className="flex items-center gap-4">
            {profile.id_document ? (
              <a 
                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/id-documents/${profile.id_document}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Voir le document
              </a>
            ) : (
              <span className="text-gray-500">Aucun document</span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('id-document-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              {profile.id_document ? "Modifier" : "Ajouter"}
            </Button>
            <input
              id="id-document-upload"
              type="file"
              accept="image/*,.pdf"
              onChange={handleIdDocumentUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
          </DialogHeader>
          <ClientProfileForm initialData={profile} onClose={() => setIsEditing(false)} />
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
