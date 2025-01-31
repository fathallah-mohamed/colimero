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

  // Initialize session and handle auth state changes
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
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Une erreur est survenue lors de la vérification de votre session.",
          });
          setIsLoading(false);
          return;
        }
        
        // Si nous sommes sur une route protégée et non authentifié
        const protectedRoutes = ['/mes-reservations', '/profile', '/demandes-approbation'];
        if (protectedRoutes.includes(location.pathname)) {
          if (!session) {
            console.log("No session found, redirecting to login");
            sessionStorage.setItem('returnPath', location.pathname);
            navigate('/connexion');
          } else {
            const userType = session.user.user_metadata?.user_type;
            // Vérifier si l'utilisateur est un transporteur pour la page demandes-approbation
            if (location.pathname === '/demandes-approbation' && userType !== 'carrier') {
              console.log("User not carrier, redirecting to home");
              navigate('/');
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Une erreur est survenue lors de la vérification de votre authentification.",
        });
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, toast]);

  // Si en cours de chargement, afficher un état de chargement minimal
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