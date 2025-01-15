import { User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  userType: string | null;
  handleLogout: () => void;
  onLoginClick: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  setIsOpen, 
  user, 
  userType,
  handleLogout,
  onLoginClick
}: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="block py-2 text-lg font-semibold" onClick={() => setIsOpen(false)}>
              Accueil
            </Link>
            <Link to="/about" className="block py-2" onClick={() => setIsOpen(false)}>
              À propos
            </Link>
            <Link to="/contact" className="block py-2" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block py-2" onClick={() => setIsOpen(false)}>
                  Mon profil
                </Link>
                {userType === 'carrier' && (
                  <Link to="/mes-tournees" className="block py-2" onClick={() => setIsOpen(false)}>
                    Mes tournées
                  </Link>
                )}
                {userType === 'client' && (
                  <Link to="/mes-reservations" className="block py-2" onClick={() => setIsOpen(false)}>
                    Mes réservations
                  </Link>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Se déconnecter
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Se connecter
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}