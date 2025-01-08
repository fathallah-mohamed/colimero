import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Upload, Mail, Phone, MapPin, Building2, FileText, Truck, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierProfileForm } from "./CarrierProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ServicesSection } from "../ServicesSection";
import { Profile } from "@/types/profile";

interface CarrierProfileViewProps {
  profile: Profile;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
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
        .from('carriers')
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
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mon profil transporteur</h1>
        <Button onClick={() => setIsEditing(true)}>
          Modifier mon profil
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <InfoItem 
              icon={Building2} 
              label="Entreprise" 
              value={profile.company_name} 
            />
            <InfoItem 
              icon={FileText} 
              label="SIRET" 
              value={profile.siret} 
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
            {profile.phone_secondary && (
              <InfoItem 
                icon={Phone} 
                label="Téléphone secondaire" 
                value={profile.phone_secondary} 
              />
            )}
            <InfoItem 
              icon={MapPin} 
              label="Adresse" 
              value={profile.address} 
            />
          </div>
        </Card>

        {/* Capacités */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Capacités</h2>
          <div className="space-y-4">
            <InfoItem 
              icon={Truck} 
              label="Capacité totale" 
              value={`${profile.carrier_capacities?.total_capacity || 0} kg`} 
            />
            <InfoItem 
              icon={Euro} 
              label="Prix par kg" 
              value={`${profile.carrier_capacities?.price_per_kg || 0} €`} 
            />
          </div>
        </Card>

        {/* Services */}
        <Card className="p-6 lg:col-span-2">
          <ServicesSection profile={profile} onUpdate={() => window.location.reload()} />
        </Card>

        {/* Documents */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <div className="flex items-center gap-4">
            {profile.id_document ? (
              <a 
                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/id-documents/${profile.id_document}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Voir le document d'identité
              </a>
            ) : (
              <span className="text-gray-500">Aucun document d'identité</span>
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
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <CarrierProfileForm
            initialData={profile}
            onClose={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}