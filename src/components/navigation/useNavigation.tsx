import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { supabase } from "@/integrations/supabase/client";
import { isPublicRoute } from "@/config/routes";
import { UserType } from "@/types/navigation";

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session check:', session?.user ? 'User logged in' : 'No user');
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserType(null);
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

  const handleAuthDialogOpen = () => {
    if (isPublicRoute(location.pathname)) {
      console.log("Route publique détectée, pas d'ouverture de la fenêtre de connexion");
      return false;
    }
    
    // Store the current path for redirection after login
    if (location.pathname.includes('/reserver/')) {
      sessionStorage.setItem('returnPath', location.pathname);
    }
    
    console.log("Route privée détectée, ouverture de la fenêtre de connexion");
    return true;
  };

  return {
    isOpen,
    setIsOpen,
    user,
    userType,
    handleLogout,
    handleAuthDialogOpen,
  };
}