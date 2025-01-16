import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import MenuItems from "./MenuItems";
import { Button } from "../ui/button";
import { UserCircle2 } from "lucide-react";
import AccountMenu from "./AccountMenu";
import { UserMenuItems } from "./UserMenuItems";

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
        "fixed inset-y-0 right-0 w-[80%] bg-white border-l shadow-lg h-[calc(100vh-65px)] top-[65px] overflow-y-auto",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {user ? (
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <UserCircle2 className="h-8 w-8 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <UserMenuItems userType={userType} />
          </div>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <MenuItems />
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginClick}
            className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white"
          >
            <UserCircle2 className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
          <div className="mt-4">
            <MenuItems />
          </div>
        </div>
      )}
    </div>
  );
}