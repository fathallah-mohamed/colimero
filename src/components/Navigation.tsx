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
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const { user, userType, handleLogout } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle click outside to close menu
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

  // Save return path for authentication
  useEffect(() => {
    if (location.pathname.includes('/reserver/')) {
      sessionStorage.setItem('returnPath', location.pathname);
    }
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link 
              to="/" 
              className="text-2xl font-bold text-primary hover:text-primary-hover transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Colimero
            </Link>
            <div className="hidden md:flex md:items-center">
              <MenuItems />
            </div>
          </div>

          <div className="flex items-center gap-6">
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

      {/* Mobile menu overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu panel */}
      <div 
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
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