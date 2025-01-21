import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MenuItems from "./MenuItems";
import { AuthSection } from "./AuthSection";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  mobileButtonRef: React.RefObject<HTMLButtonElement>;
  showAuthDialog?: boolean;
  setShowAuthDialog: (show: boolean) => void;
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className={cn(
              "transition-all duration-300",
              isScrolled ? "h-8 w-auto" : "h-12 w-auto"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </Link>
        <div className="hidden lg:flex lg:ml-10">
          <MenuItems />
        </div>
      </div>

      <div className="flex items-center">
        <AuthSection
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setShowAuthDialog={() => setShowAuthDialog(true)}
        />
        <MobileMenuButton
          ref={mobileButtonRef}
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        />
      </div>
    </div>
  );
}