import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { menuItems } from "./config/menuItems";
import { UserCog } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setShowAuthDialog: (show: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  handleLogout,
  setIsOpen,
  setShowAuthDialog,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-50 bg-black bg-opacity-25" />
      <nav className="fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col p-4 bg-white space-y-2 overflow-y-auto">
        {!user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAuthDialog(true);
              setIsOpen(false);
            }}
            className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
          >
            Se connecter
          </Button>
        )}

        {menuItems.map((item) => {
          const isAllowed = !userType || item.allowedUserTypes.includes(userType);
          if (!isAllowed) return null;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
                ${item.highlight
                  ? "text-[#00B0F0] hover:text-[#0082b3] " + (item.className || "")
                  : "text-gray-700 hover:text-gray-900"
                }`}
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          );
        })}

        {user && (
          <>
            {userType === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <UserCog className="w-4 h-4" />
                <span className="ml-2">Administrateurs</span>
              </Link>
            )}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Mon profil
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-red-600 hover:text-red-700"
            >
              Déconnexion
            </Button>
          </>
        )}
      </nav>
    </div>
  );
}