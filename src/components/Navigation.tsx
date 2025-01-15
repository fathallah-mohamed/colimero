import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/use-navigation";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";
import MenuItems from "@/components/navigation/MenuItems";
import MobileMenu from "@/components/navigation/MobileMenu";
import AuthDialog from "@/components/auth/AuthDialog";
import { RegisterForm } from "@/components/auth/RegisterForm";
import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AuthSection } from "@/components/navigation/AuthSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        setIsInitializing(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Une erreur est survenue lors de la récupération de votre session. Veuillez vous reconnecter.",
          });
          await handleLogout();
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log('Auth event:', event);

          if (event === 'SIGNED_IN') {
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .select('email_verified')
              .eq('id', newSession?.user?.id)
              .single();

            if (clientError) {
              console.error("Error fetching client:", clientError);
              return;
            }

            if (!client?.email_verified) {
              toast({
                variant: "destructive",
                title: "Compte non activé",
                description: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter.",
              });
              await supabase.auth.signOut();
              return;
            }

            if (sessionStorage.getItem('returnPath')) {
              const returnPath = sessionStorage.getItem('returnPath');
              sessionStorage.removeItem('returnPath');
              navigate(returnPath || '/');
            }
          } else if (event === 'SIGNED_OUT') {
            if (location.pathname.includes('/reserver/')) {
              navigate('/');
            }
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
        });

        // If there's no session, try to refresh it
        if (!session) {
          console.log('No session found, attempting refresh...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            toast({
              variant: "destructive",
              title: "Erreur de session",
              description: "Votre session a expiré. Veuillez vous reconnecter.",
            });
            await handleLogout();
          } else if (refreshData.session) {
            console.log('Session refreshed successfully');
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Session initialization error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation de la session",
        });
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initSession();

    const handleScroll = () => {
      if (!mounted) return;
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, navigate, toast, handleLogout]);

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

  useEffect(() => {
    if (location.pathname.includes('/reserver/')) {
      sessionStorage.setItem('returnPath', location.pathname);
    }
  }, [location.pathname]);

  if (isInitializing) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300",
      isScrolled ? "shadow-lg py-2" : "shadow-sm py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center"
            initial={false}
            animate={{ scale: isScrolled ? 0.95 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              to="/" 
              className="text-2xl lg:text-3xl font-bold text-primary hover:opacity-90 transition-opacity"
            >
              Colimero
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
            <MenuItems />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <AuthSection
              user={user}
              userType={userType}
              handleLogout={handleLogout}
              setShowAuthDialog={setShowAuthDialog}
            />
            
            <MobileMenuButton 
              ref={mobileButtonRef}
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="block lg:hidden"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
          setShowAuthDialog={setShowAuthDialog}
        />
      </div>

      {/* Dialogs */}
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => setShowAuthDialog(false)}
        onRegisterClick={() => {
          setShowAuthDialog(false);
          setShowRegisterForm(true);
        }}
        onCarrierRegisterClick={() => {
          setShowAuthDialog(false);
          setShowCarrierSignupForm(true);
        }}
      />

      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
        <DialogContent className="max-w-2xl">
          <RegisterForm onLogin={() => {
            setShowRegisterForm(false);
            setShowAuthDialog(true);
          }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showCarrierSignupForm} onOpenChange={setShowCarrierSignupForm}>
        <DialogContent className="max-w-2xl">
          <CarrierSignupForm onSuccess={() => {
            setShowCarrierSignupForm(false);
          }} />
        </DialogContent>
      </Dialog>
    </nav>
  );
}
