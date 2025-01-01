import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { MenuItem } from "./MenuItems";

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
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    } else {
      setUser(null);
      setUserType(null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/');
    }
  };

  const menuItems: MenuItem[] = [
    { 
      name: "Planifier une tournée", 
      href: "/planifier-une-tournee", 
      highlight: true,
    },
    { name: "Envoyer un colis", href: "/envoyer-un-colis", highlight: true },
    { name: "Transporteurs", href: "/nos-transporteurs" },
    { name: "Actualités", href: "/actualites" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/nous-contacter" },
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