import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { MenuItem } from "./MenuItems";
import { Package2, Truck, Calendar } from "lucide-react";

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setUserType(session?.user?.user_metadata?.user_type ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUserType(session?.user?.user_metadata?.user_type ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
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
  };

  const menuItems: MenuItem[] = [
    { 
      name: "Envoyer un colis", 
      href: "/envoyer-colis",
      icon: Package2
    },
    { 
      name: "Transporteurs", 
      href: "/transporteurs",
      icon: Truck
    },
    { 
      name: "Tournées", 
      href: "/tours",
      icon: Calendar
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