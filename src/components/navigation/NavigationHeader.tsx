import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MenuItems from "./MenuItems";
import { AuthSection } from "./AuthSection";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";

interface NavigationHeaderProps {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  mobileButtonRef: React.RefObject<HTMLButtonElement>;
  showAuthDialog?: boolean;
  setShowAuthDialog?: (show: boolean) => void;
}

export function NavigationHeader({
  isScrolled,
  isOpen,
  setIsOpen,
  user,
  userType,
  handleLogout,
  mobileButtonRef,
  showAuthDialog,
  setShowAuthDialog
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (setShowAuthDialog) {
      setShowAuthDialog(true);
    } else {
      navigate('/connexion');
    }
  };

  return (
    <div className="flex justify-between items-center">
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

      <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
        <MenuItems />
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <AuthSection
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setShowAuthDialog={handleLoginClick}
        />
        
        <MobileMenuButton 
          ref={mobileButtonRef}
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="block lg:hidden"
        />
      </div>
    </div>
  );
}