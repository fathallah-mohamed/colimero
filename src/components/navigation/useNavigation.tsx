import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";
import { MenuItem } from "./MenuItems";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      const userType = session?.user?.user_metadata?.user_type;
      setUserType(userType);

      // Vérifier si l'utilisateur est un administrateur
      if (userType === 'admin' && session?.user) {
        const { data: adminData, error } = await supabase
          .from('administrators')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !adminData) {
          console.error('Erreur de vérification admin:', error);
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès administrateur.",
          });
          handleLogout();
          return;
        }
      }
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