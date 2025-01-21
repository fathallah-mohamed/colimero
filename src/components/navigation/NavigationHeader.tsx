import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { MobileMenuButton } from "../ui/mobile-menu-button";
import { AuthSection } from "./AuthSection";
import MenuItems from "./MenuItems";
import { User } from "@supabase/supabase-js";

interface NavigationHeaderProps {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  userType: string | null;
  handleLogout: () => void;
  mobileButtonRef: React.RefObject<HTMLButtonElement>;
}

export function NavigationHeader({
  isScrolled,
  isOpen,
  setIsOpen,
  user,
  userType,
  handleLogout,
  mobileButtonRef,
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/connexion');
  };

  return (
    <div className="relative flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className={`transition-all duration-300 ${
              isScrolled ? "h-8 w-auto" : "h-10 w-auto"
            }`}
          />
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          <MenuItems />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <div className="hidden lg:block">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLoginClick}
              className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </div>
        ) : (
          <AuthSection 
            user={user}
            userType={userType}
            handleLogout={handleLogout}
          />
        )}

        <div className="lg:hidden">
          <MobileMenuButton
            ref={mobileButtonRef}
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
    </div>
  );
}