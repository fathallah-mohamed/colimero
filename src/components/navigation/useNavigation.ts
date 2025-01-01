import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface MenuItem {
  name: string;
  href: string;
  highlight?: boolean;
}

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

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
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems: MenuItem[] = [
    { name: "Planifier une tournée", href: "/planifier-une-tournee", highlight: true },
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