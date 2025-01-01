import { User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuItem } from "./useNavigation";
import { Link } from "react-router-dom";

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
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block py-2 text-sm"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Mon profil
              </Link>
              {userType === 'carrier' && (
                <Link
                  to="/mes-tournees"
                  className="block py-2 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Mes tournées
                </Link>
              )}
              {userType === 'client' && (
                <Link
                  to="/mes-reservations"
                  className="block py-2 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Mes réservations
                </Link>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start px-0 text-red-600"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
              >
                Se déconnecter
              </Button>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}