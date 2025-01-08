import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { menuItems } from "./MenuItems";
import { UserMenuItems } from "./UserMenuItems";

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
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <Link 
          to="/" 
          className="text-xl font-bold text-primary"
          onClick={() => setIsOpen(false)}
        >
          Colimero
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <span className="sr-only">Fermer le menu</span>
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300",
              item.highlight 
                ? "text-white bg-gradient-primary hover:opacity-90 shadow-md" + (item.className || "")
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            {item.icon && <span className="w-5 h-5 mr-3">{item.icon}</span>}
            <span>{item.name}</span>
          </Link>
        ))}

        {user ? (
          <div className="border-t border-gray-200 pt-6">
            <div className="px-3 py-2 text-sm text-gray-500">
              {user.email}
            </div>
            <div className="mt-3 space-y-3">
              <UserMenuItems userType={userType} />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-6">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                setShowAuthDialog(true);
                setIsOpen(false);
              }}
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground
                transition-all duration-300 ease-in-out
                hover:shadow-[0_0_15px_rgba(155,135,245,0.5)]"
            >
              <UserCircle2 className="w-5 h-5 mr-2" />
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}