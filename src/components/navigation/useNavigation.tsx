import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { MenuItem } from "./MenuItems";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        setUserType(null);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        setUserType(session?.user?.user_metadata?.user_type ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserType(null);
        navigate('/');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const result = await handleLogoutFlow();
      
      if (result.success) {
        setUser(null);
        setUserType(null);
        toast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la déconnexion",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  const menuItems: MenuItem[] = [
    { 
      name: "Planifier une tournée", 
      href: "/planifier-une-tournee", 
      highlight: true,
      icon: <Calendar className="w-4 h-4 mr-1.5" />
    },
    { 
      name: "Envoyer un colis", 
      href: "/envoyer-un-colis", 
      highlight: true,
      icon: <Package className="w-4 h-4 mr-1.5" />
    },
    { 
      name: "Transporteurs", 
      href: "/nos-transporteurs",
      icon: <Truck className="w-4 h-4 mr-1.5" />
    },
    { 
      name: "Actualités", 
      href: "/actualites",
      icon: <MessageSquare className="w-4 h-4 mr-1.5" />
    },
    { 
      name: "À propos", 
      href: "/a-propos",
      icon: <Info className="w-4 h-4 mr-1.5" />
    },
    { 
      name: "Contact", 
      href: "/nous-contacter",
      icon: <Users className="w-4 h-4 mr-1.5" />
    }
  ];

  return {
    isOpen,
    setIsOpen,
    user,
    userType,
    handleLogout,
    menuItems,
  };
}