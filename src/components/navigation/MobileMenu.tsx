import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems, adminMenuItem } from "./config/menuItems";
import { MenuItem } from "./MenuItem";
import { UserMenuItems } from "./UserMenuItems";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (value: boolean) => void;
  setShowAuthDialog: (value: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
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
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00B0F0]"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Fermer le menu</span>
        </button>
      </div>

      <div className="h-full overflow-y-auto px-2 pb-3 space-y-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.name}
            {...item}
            userType={userType}
            onClick={() => setIsOpen(false)}
          />
        ))}

        {user ? (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="px-3 py-2 text-sm text-gray-600">
              {user.email}
            </div>
            <UserMenuItems userType={userType} />
            {userType === "admin" && (
              <MenuItem
                {...adminMenuItem}
                userType={userType}
                onClick={() => setIsOpen(false)}
              />
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
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
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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