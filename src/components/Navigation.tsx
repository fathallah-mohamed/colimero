import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigation } from "./navigation/useNavigation";
import { AuthSection } from "./navigation/AuthSection";
import { MobileMenuButton } from "./navigation/MobileMenuButton";
import MenuItems from "./navigation/MenuItems";
import MobileMenu from "./navigation/MobileMenu";
import AuthDialog from "./auth/AuthDialog";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, userType, handleLogout } = useNavigation();

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
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        user={user}
        userType={userType}
        userMenuItems={[]}
        handleLogout={handleLogout}
        setIsOpen={setIsOpen}
        setShowAuthDialog={setShowAuthDialog}
      />

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </nav>
  );
}