import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function useNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // First try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            if (mounted) {
              setUser(null);
              setUserType(null);
            }
            return;
          }
          
          if (mounted && refreshData.session) {
            setUser(refreshData.session.user);
            setUserType(refreshData.session.user.user_metadata?.user_type ?? null);
          }
          return;
        }

        if (mounted && session?.user) {
          setUser(session.user);
          setUserType(session.user.user_metadata?.user_type ?? null);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setUser(session?.user ?? null);
            setUserType(session?.user?.user_metadata?.user_type ?? null);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setUserType(null);
            navigate('/');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setUser(null);
          setUserType(null);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // First clear local state
      setUser(null);
      setUserType(null);

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        if (error.message.includes('session')) {
          // If it's a session error, we'll still consider the user logged out locally
          toast({
            title: "Déconnexion réussie",
            description: "Votre session a été terminée.",
          });
          navigate('/');
          return;
        }
        throw error;
      }

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });

      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state and redirect
      navigate('/');
    }
  };

  return { user, userType, handleLogout };
}