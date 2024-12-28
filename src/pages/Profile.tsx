import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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
        .select('*')
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
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
        {profile && (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Informations personnelles</h2>
              <p className="text-gray-600">Nom: {profile.first_name} {profile.last_name}</p>
              <p className="text-gray-600">Email: {profile.email}</p>
              <p className="text-gray-600">Téléphone: {profile.phone}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Informations entreprise</h2>
              <p className="text-gray-600">Nom de l'entreprise: {profile.company_name}</p>
              <p className="text-gray-600">SIRET: {profile.siret}</p>
              <p className="text-gray-600">Adresse: {profile.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}