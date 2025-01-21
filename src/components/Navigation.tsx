import { useState } from "react";
import { AuthDialogs } from "./navigation/AuthDialogs";
import { useNavigation } from "@/hooks/use-navigation";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { MenuItems } from "./navigation/MenuItems";
import { MobileMenu } from "./navigation/MobileMenu";
import { useSessionInitializer } from "./navigation/SessionInitializer";

interface NavigationProps {
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

export default function Navigation({ showAuthDialog, setShowAuthDialog }: NavigationProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierSignupForm, setShowCarrierSignupForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, handleLogout } = useNavigation();

  // Initialize session
  useSessionInitializer();

  return (
    <>
      <NavigationHeader
        isScrolled={false}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        userType={userType}
        handleLogout={handleLogout}
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
      />

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        userType={userType}
        handleLogout={handleLogout}
      />

      <AuthDialogs
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        showRegisterForm={showRegisterForm}
        setShowRegisterForm={setShowRegisterForm}
        showCarrierSignupForm={showCarrierSignupForm}
        setShowCarrierSignupForm={setShowCarrierSignupForm}
      />
    </>
  );
}