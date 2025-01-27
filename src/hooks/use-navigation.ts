import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

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

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (error) {
        console.error("Logout error:", error);
        navigate('/');
        return;
      }

      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/');
    }
  };

  return { user, userType, handleLogout };
}