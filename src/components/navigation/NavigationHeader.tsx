import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MenuItems } from "./MenuItems";
import { AuthSection } from "./AuthSection";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";
import { User } from "@supabase/supabase-js";

interface NavigationHeaderProps {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  userType: string | null;
  handleLogout: () => void;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

export function NavigationHeader({
  isScrolled,
  isOpen,
  setIsOpen,
  user,
  userType,
  handleLogout,
  showAuthDialog,
  setShowAuthDialog
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-[#00B0F0]">
            Logo
          </Link>

          <MenuItems isAuthenticated={!!user} userType={userType} />
        </div>

        <div className="flex items-center gap-4">
          <AuthSection
            user={user}
            userType={userType}
            handleLogout={handleLogout}
            setShowAuthDialog={() => setShowAuthDialog(true)}
          />

          <MobileMenuButton
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
          />
        </div>
      </nav>
    </motion.header>
  );
}