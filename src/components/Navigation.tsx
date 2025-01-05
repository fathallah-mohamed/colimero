import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "./navigation/useNavigation";
import { AuthSection } from "./navigation/AuthSection";
import { MobileMenuButton } from "./navigation/MobileMenuButton";
import MenuItems from "./navigation/MenuItems";
import MobileMenu from "./navigation/MobileMenu";
import { AuthDialog } from "./auth/AuthDialog";
import { RegisterForm } from "./auth/RegisterForm";
import CarrierSignupForm from "./auth/CarrierSignupForm";
import { Dialog, DialogContent } from "./ui/dialog";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
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

  useEffect(() => {
    if (location.pathname.includes('/reserver/')) {
      sessionStorage.setItem('returnPath', location.pathname);
    }
  }, [location.pathname]);

  const handleRegisterClick = () => {
    setShowAuthDialog(false);
    setShowRegisterForm(true);
  };

  const handleCarrierRegisterClick = () => {
    setShowAuthDialog(false);
    setShowCarrierSignupForm(true);
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
              setShowAuthDialog={setShowAuthDialog}
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
          setShowAuthDialog={setShowAuthDialog}
        />
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        fromHeader={true}
        onRegisterClick={handleRegisterClick}
        onCarrierRegisterClick={handleCarrierRegisterClick}
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