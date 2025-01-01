import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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
  onLogout 
}: MobileMenuProps) {
  const onClose = () => setIsOpen(false);

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-50`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              onClose();
              if (item.onClick) item.onClick(e);
            }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              item.highlight
                ? "text-[#00B0F0]"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.name}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              to="/profil"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={onClose}
            >
              Profil
            </Link>
            {userType === 'carrier' ? (
              <>
                <Link
                  to="/mes-tournees"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  Mes tournées
                </Link>
                <Link
                  to="/demandes-approbation"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  Demandes d'approbation
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/mes-reservations"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  Mes réservations
                </Link>
                <Link
                  to="/demandes-approbation"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  Mes demandes d'approbation
                </Link>
              </>
            )}
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <div className="mt-4 px-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/connexion">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}