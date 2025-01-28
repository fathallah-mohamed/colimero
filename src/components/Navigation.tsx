import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/navigation/MobileMenu";
import { useSessionInitializer } from "./navigation/SessionInitializer";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  showAuthDialog?: boolean;
  setShowAuthDialog?: (show: boolean) => void;
}

export default function Navigation({ showAuthDialog: externalShowAuthDialog, setShowAuthDialog: externalSetShowAuthDialog }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useSessionInitializer();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Store return path for auth redirects and handle protected routes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        // Liste des routes protégées qui nécessitent une authentification
        const protectedRoutes = ['/mes-reservations', '/profile', '/demandes-approbation'];
        
        // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
        if (protectedRoutes.includes(location.pathname) && !session) {
          sessionStorage.setItem('returnPath', location.pathname);
          navigate('/connexion');
          setIsLoading(false);
          return;
        }

        // Si l'utilisateur est connecté
        if (session?.user) {
          const userType = session.user.user_metadata?.user_type;

          // Vérification spécifique pour les clients
          if (userType === 'client') {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('email_verified, status')
              .eq('id', session.user.id)
              .maybeSingle();

            if (clientError) {
              console.error("Error checking client status:", clientError);
              setIsLoading(false);
              return;
            }

            // Redirection vers l'activation du compte si nécessaire
            if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
              console.log("Account needs verification, redirecting to activation");
              await supabase.auth.signOut();
              navigate('/activation-compte');
              setIsLoading(false);
              return;
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, toast]);

  if (isLoading) {
    return (
      <nav className={cn(
        "fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300",
        isScrolled ? "shadow-lg py-2" : "shadow-sm py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-gray-500">Chargement...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300",
      isScrolled ? "shadow-lg py-2" : "shadow-sm py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationHeader
          isScrolled={isScrolled}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          mobileButtonRef={mobileButtonRef}
        />
      </div>

      <div 
        ref={mobileMenuRef}
        className={cn(
          "block lg:hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <MobileMenu
          isOpen={isOpen}
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setIsOpen={setIsOpen}
        />
      </div>
    </nav>
  );
}