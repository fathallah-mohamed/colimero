import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigation } from "./navigation/useNavigation";
import { AuthSection } from "./navigation/AuthSection";
import { MobileMenuButton } from "./navigation/MobileMenuButton";
import MenuItems from "./navigation/MenuItems";
import MobileMenu from "./navigation/MobileMenu";
import AuthDialog from "./auth/AuthDialog";
import { RegisterForm } from "./auth/RegisterForm";
import CarrierSignupForm from "./auth/carrier-signup/CarrierSignupForm";
import { Dialog, DialogContent } from "./ui/dialog";
import { isPublicRoute } from "@/config/routes";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { 
    user, 
    userType, 
    handleLogout, 
    handleAuthDialogOpen 
  } = useNavigation();
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

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

  const onAuthDialogOpen = () => {
    // Ne pas ouvrir le dialogue si nous sommes sur une route publique
    if (isPublicRoute(location.pathname)) {
      console.log("Route publique, pas d'ouverture du dialogue d'authentification");
      return;
    }

    const shouldOpen = handleAuthDialogOpen();
    if (shouldOpen) {
      console.log("Ouverture du dialogue d'authentification");
      setShowAuthDialog(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#00B0F0] hover:text-[#0082b3] transition-colors">
            Colimero
          </Link>

          <MenuItems />

          <div className="flex items-center space-x-4">
            <AuthSection 
              user={user}
              userType={userType}
              handleLogout={handleLogout}
              setShowAuthDialog={onAuthDialogOpen}
            />
            
            <MobileMenuButton 
              ref={mobileButtonRef}
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>

      <div ref={mobileMenuRef}>
        <MobileMenu
          isOpen={isOpen}
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setIsOpen={setIsOpen}
          setShowAuthDialog={onAuthDialogOpen}
        />
      </div>

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