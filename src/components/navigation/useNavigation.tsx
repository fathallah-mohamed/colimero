import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { supabase } from "@/integrations/supabase/client";

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const mounted = useRef(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setUserType(session?.user?.user_metadata?.user_type ?? null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setUser(null);
          setUserType(null);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
          setUserType(session?.user?.user_metadata?.user_type ?? null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserType(null);
          navigate('/');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

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