import Navigation from "@/components/Navigation";
import { TourHeader } from "@/components/tour/TourHeader";
import { TourContent } from "@/components/tour/TourContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function MesTournees() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TourHeader />
          <div className="mt-8">
            <TourContent />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}