import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { menuItems } from "./MenuItems";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  userMenuItems: any[];
  handleLogout: () => void;
  setIsOpen: (value: boolean) => void;
  setShowAuthDialog: (value: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userMenuItems,
  handleLogout,
  setIsOpen,
  setShowAuthDialog
}: MobileMenuProps) {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              item.highlight
                ? "text-[#00B0F0] hover:text-[#0082b3]"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ))}

        {user ? (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="px-3 py-2 text-sm text-gray-600">
              {user.email}
            </div>
            {userMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full mt-2 text-red-600 hover:text-red-700"
            >
              Déconnexion
            </Button>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowAuthDialog(true);
                setIsOpen(false);
              }}
              className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}