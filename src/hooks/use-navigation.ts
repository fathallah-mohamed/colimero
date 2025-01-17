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
          if (mounted) {
            setUser(null);
            setUserType(null);
          }
          return;
        }

        if (mounted && session?.user) {
          setUser(session.user);
          setUserType(session.user.user_metadata?.user_type ?? null);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          console.log("Auth state change:", event, session?.user?.id);

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

      // Try to refresh the session before signing out
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.log("Session refresh error:", refreshError);
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        // Handle session-related errors gracefully
        if (error.message.includes('session_not_found') || 
            error.message.includes('Session') || 
            error.status === 403) {
          toast({
            title: "Déconnexion réussie",
            description: "Votre session a été terminée.",
          });
          navigate('/');
          return;
        }
        // For other errors, throw them to be caught below
        throw error;
      }

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });

      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure user is logged out locally even if there's an error
      toast({
        title: "Déconnexion réussie",
        description: "Votre session a été terminée.",
      });
      navigate('/');
    }
  };

  return { user, userType, handleLogout };
}