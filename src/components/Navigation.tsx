import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/navigation/MobileMenu";
import { useSessionInitializer } from "./navigation/SessionInitializer";
import { AuthDialogs } from "./navigation/AuthDialogs";
import { NavigationHeader } from "./navigation/NavigationHeader";

interface NavigationProps {
  showAuthDialog?: boolean;
  setShowAuthDialog?: (show: boolean) => void;
}

export default function Navigation({ showAuthDialog: externalShowAuthDialog, setShowAuthDialog: externalSetShowAuthDialog }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use internal state if no external state is provided
  const [internalShowAuthDialog, setInternalShowAuthDialog] = useState(false);
  const showAuthDialogValue = externalShowAuthDialog ?? internalShowAuthDialog;
  const setShowAuthDialogValue = externalSetShowAuthDialog ?? setInternalShowAuthDialog;

  // Initialize session and handle auth state changes
  useSessionInitializer();

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside mobile menu
  React.useEffect(() => {
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

  // Store return path for auth redirects
  React.useEffect(() => {
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
        <NavigationHeader
          isScrolled={isScrolled}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setShowAuthDialog={setShowAuthDialogValue}
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
          setShowAuthDialog={setShowAuthDialogValue}
        />
      </div>

      <AuthDialogs
        showAuthDialog={showAuthDialogValue}
        setShowAuthDialog={setShowAuthDialogValue}
        showRegisterForm={showRegisterForm}
        setShowRegisterForm={setShowRegisterForm}
        showCarrierSignupForm={showCarrierSignupForm}
        setShowCarrierSignupForm={setShowCarrierSignupForm}
      />
    </nav>
  );
}