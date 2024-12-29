import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkUser();
    fetchProfile();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
  };

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('carriers')
        .select(`
          *,
          carrier_capacities (
            total_capacity,
            price_per_kg,
            offers_home_delivery
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <ProfileHeader onEdit={() => setIsEditing(true)} />
              <DeleteAccountButton />
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Modifier mon profil</DialogTitle>
                </DialogHeader>
                <ProfileForm 
                  initialData={profile} 
                  onClose={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }} 
                />
              </DialogContent>
            </Dialog>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Prénom</p>
                      <p className="text-gray-900">{profile.first_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="text-gray-900">{profile.last_name || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profile.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{profile.phone || "-"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations entreprise</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom de l'entreprise</p>
                    <p className="text-gray-900">{profile.company_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SIRET</p>
                    <p className="text-gray-900">{profile.siret || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-gray-900">{profile.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zones de couverture</p>
                    <p className="text-gray-900">
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
                    <p className="text-sm text-gray-500">Capacité totale</p>
                    <p className="text-gray-900">{profile.carrier_capacities?.total_capacity || "-"} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix par kg</p>
                    <p className="text-gray-900">{profile.carrier_capacities?.price_per_kg || "-"} €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}