import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { AdminProfileView } from "@/components/profile/AdminProfileView";
import { CarrierProfileView } from "@/components/profile/CarrierProfileView";
import { ClientProfileView } from "@/components/profile/ClientProfileView";
import { useProfile } from "@/hooks/use-profile";
import { ProfileLoading } from "@/components/profile/ProfileLoading";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading, userType } = useProfile();

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

  if (loading) {
    return <ProfileLoading />;
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