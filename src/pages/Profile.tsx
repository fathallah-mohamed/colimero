import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ClientProfileForm } from "@/components/profile/ClientProfileForm";
import { ClientProfileView } from "@/components/profile/ClientProfileView";
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
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    fetchProfile();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
    setUserType(session?.user?.user_metadata?.user_type || null);
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userType = session.user.user_metadata?.user_type;
        const table = userType === 'carrier' ? 'carriers' : 'clients';
        
        const query = supabase
          .from(table)
          .select(userType === 'carrier' ? `
            *,
            carrier_capacities (
              total_capacity,
              price_per_kg,
              offers_home_delivery
            ),
            carrier_services (
              service_type,
              icon
            )
          ` : '*')
          .eq('id', session.user.id);

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger votre profil",
          });
          return;
        }

        if (!data) {
          toast({
            variant: "destructive",
            title: "Profil non trouvé",
            description: "Votre profil n'a pas été trouvé",
          });
          return;
        }

        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Profil non trouvé</h2>
            <p className="mt-2 text-gray-600">
              Nous n'avons pas pu trouver votre profil. Veuillez vous reconnecter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <ProfileHeader onEdit={() => setIsEditing(true)} />

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    Modifier mon profil
                  </DialogTitle>
                </DialogHeader>
                {userType === 'carrier' ? (
                  <ProfileForm 
                    initialData={profile} 
                    onClose={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                  />
                ) : (
                  <ClientProfileForm 
                    initialData={profile} 
                    onClose={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                  />
                )}
              </DialogContent>
            </Dialog>

            {userType === 'carrier' ? (
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations entreprise</h2>
                <div className="bg-gray-50/50 rounded-lg p-6 space-y-4 border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nom de l'entreprise</p>
                    <p className="text-gray-900 font-medium">{profile.company_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">SIRET</p>
                    <p className="text-gray-900 font-medium">{profile.siret || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Adresse</p>
                    <p className="text-gray-900 font-medium">{profile.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Zones de couverture</p>
                    <p className="text-gray-900 font-medium">
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
                    <p className="text-sm text-gray-500 mb-1">Capacité totale</p>
                    <p className="text-gray-900 font-medium">{profile.carrier_capacities?.total_capacity || "-"} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prix par kg</p>
                    <p className="text-gray-900 font-medium">{profile.carrier_capacities?.price_per_kg || "-"} €</p>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <ClientProfileView profile={profile} />
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
