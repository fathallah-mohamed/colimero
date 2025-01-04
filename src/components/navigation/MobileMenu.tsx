import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { menuItems } from "./MenuItems";
import { cn } from "@/lib/utils";

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
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-64 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="px-2 pt-20 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                item.highlight 
                  ? "text-primary hover:text-primary-hover hover:bg-primary/10" + (item.className || "")
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              )}
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
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
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
                className="w-full mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-200"
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
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}