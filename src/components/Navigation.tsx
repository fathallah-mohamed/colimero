import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const renderAuthSection = () => {
    if (!user) {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAuthDialog(true)}
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
          >
            <UserCircle2 className="w-4 h-4 mr-2" />
            {userType === 'admin' ? 'Administration' : userType === 'carrier' ? 'Mon compte transporteur' : 'Mon compte client'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profil" className="w-full">Profil</Link>
          </DropdownMenuItem>
          {userType === 'admin' && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/admin" className="w-full">Demandes d'inscription</Link>
              </DropdownMenuItem>
            </>
          )}
          {userType === 'carrier' && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/mes-tournees" className="w-full">Mes tournées</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/demandes-approbation" className="w-full">Demandes d'approbation</Link>
              </DropdownMenuItem>
            </>
          )}
          {userType === 'client' && (
            <DropdownMenuItem asChild>
              <Link to="/mes-reservations" className="w-full">Mes réservations</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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
            <div className="hidden md:block">
              {renderAuthSection()}
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