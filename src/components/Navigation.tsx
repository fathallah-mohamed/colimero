import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigation } from "@/hooks/use-navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";
import MenuItems from "./navigation/MenuItems";
import MobileMenu from "./navigation/MobileMenu";
import MobileMenuButton from "./navigation/MobileMenuButton";
import AuthDialog from "./auth/AuthDialog";
import { RegisterForm } from "./auth/RegisterForm";
import CarrierSignupForm from "./auth/carrier-signup/CarrierSignupForm";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <MenuItems />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <UserCircle2 className="w-4 h-4 mr-1.5" />
                      Profil
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setShowAuthDialog(true)}
                >
                  <UserCircle2 className="w-4 h-4 mr-1.5" />
                  Se connecter
                </Button>
              )}
            </div>
            
            <MobileMenuButton 
              ref={mobileButtonRef}
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
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