import { User } from "@supabase/supabase-js";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  menuItems: MenuItem[];
  user: User | null;
  userType: string | null;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  menuItems,
  user,
  userType,
  onLogout,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-2 py-1 rounded-lg ${
                item.highlight
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {user && (
            <>
              <Link
                to="/profile"
                className="block px-2 py-1 text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Mon profil
              </Link>
              {userType === 'carrier' && (
                <Link
                  to="/mes-tournees"
                  className="block px-2 py-1 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Mes tournées
                </Link>
              )}
              {userType === 'client' && (
                <Link
                  to="/mes-reservations"
                  className="block px-2 py-1 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Mes réservations
                </Link>
              )}
              <Button
                variant="ghost"
                className="justify-start px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}