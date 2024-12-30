import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { handleLogoutFlow } from "@/utils/auth/logout";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      setUser(session?.user ?? null);
      setUserType(session?.user?.user_metadata?.user_type ?? null);
    };

    checkSession();

    // Listen for auth state changes
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

  const menuItems = [
    { name: "Planifier une tournée", href: "/planifier-une-tournee", highlight: true },
    { name: "Envoyer un colis", href: "/envoyer-un-colis", highlight: true },
    { name: "Transporteurs", href: "/nos-transporteurs" },
    { name: "Actualités", href: "/actualites" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/nous-contacter" },
  ];

  const renderAccountMenu = () => {
    if (!user) return null;

    const isCarrier = userType === 'carrier';
    const menuLabel = isCarrier ? "Mon compte transporteur" : "Mon compte";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Mon compte</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profil">Profil</Link>
          </DropdownMenuItem>
          {isCarrier ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/mes-tournees">Mes tournées</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/demandes-approbation">Demandes d'approbation</Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link to="/mes-reservations">Mes réservations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/demandes-approbation">Mes demandes d'approbation</Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#00B0F0]">
            Colimero
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base ${
                  item.highlight
                    ? "text-[#00B0F0] font-medium"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              renderAccountMenu()
            ) : (
              <Button asChild variant="outline" className="ml-4">
                <Link to="/connexion">Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.highlight
                  ? "text-[#00B0F0]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profil"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Profil
              </Link>
              {userType === 'carrier' ? (
                <>
                  <Link
                    to="/mes-tournees"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes tournées
                  </Link>
                  <Link
                    to="/demandes-approbation"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Demandes d'approbation
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/mes-reservations"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes réservations
                  </Link>
                  <Link
                    to="/demandes-approbation"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes demandes d'approbation
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <div className="mt-4 px-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/connexion">Se connecter</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
