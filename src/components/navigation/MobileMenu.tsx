import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import MenuItems from "./MenuItems";
import { Button } from "../ui/button";
import { UserCircle2 } from "lucide-react";
import AccountMenu from "./AccountMenu";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  handleLogout,
  setIsOpen,
}: MobileMenuProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate('/connexion');
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-[65px] bg-white border-t shadow-lg",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="px-4 pt-2 pb-3 space-y-1">
        <MenuItems />
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        {!user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginClick}
            className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white"
          >
            <UserCircle2 className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        ) : (
          <AccountMenu
            userType={userType}
            onClose={() => {
              handleLogout();
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}