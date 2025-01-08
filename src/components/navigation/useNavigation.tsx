import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { supabase } from "@/integrations/supabase/client";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/connexion',
  '/login',
  '/envoyer-colis',
  '/planifier-tournee',
  '/transporteurs',
  '/blog',
  '/a-propos',
  '/contact'
];

// Helper function to check if a route is public
const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);

        // Only redirect to login if the current route requires authentication
        if (!session?.user && !isPublicRoute(location.pathname)) {
          console.log('Redirecting to login, current path:', location.pathname);
          navigate('/connexion');
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        setUserType(null);
        
        // Only redirect to login if the current route requires authentication
        if (!isPublicRoute(location.pathname)) {
          console.log('Error redirecting to login, current path:', location.pathname);
          navigate('/connexion');
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserType(null);
        // Only redirect to home if not already on a public route
        if (!isPublicRoute(location.pathname)) {
          navigate('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      setUser(null);
      setUserType(null);
      
      const result = await handleLogoutFlow();
      
      if (result.success) {
        toast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Note",
          description: "Session terminée. Vous avez été déconnecté.",
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setUserType(null);
      toast({
        variant: "destructive",
        title: "Note",
        description: "Session terminée. Vous avez été déconnecté.",
      });
      navigate('/');
    }
  };

  return {
    isOpen,
    setIsOpen,
    user,
    userType,
    handleLogout,
  };
}