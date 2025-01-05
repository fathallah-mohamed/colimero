import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { AdminProfileView } from "@/components/profile/AdminProfileView";
import { CarrierProfileView } from "@/components/profile/CarrierProfileView";
import { ClientProfileView } from "@/components/profile/ClientProfileView";
import { useProfile } from "@/hooks/use-profile";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading, error } = useProfile();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page.",
      });
      navigate("/connexion");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-500">Une erreur est survenue lors du chargement du profil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {profile?.user_type === 'admin' && <AdminProfileView profile={profile} />}
        {profile?.user_type === 'carrier' && <CarrierProfileView profile={profile} />}
        {profile?.user_type === 'client' && <ClientProfileView profile={profile} />}
      </div>
    </div>
  );
}