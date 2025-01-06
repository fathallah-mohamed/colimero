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
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading, userType } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page.",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userType === 'admin' && <AdminProfileView profile={profile} />}
        {userType === 'carrier' && <CarrierProfileView profile={profile} />}
        {userType === 'client' && <ClientProfileView profile={profile} />}
      </div>
    </div>
  );
}