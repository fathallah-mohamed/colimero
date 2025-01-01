import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { MenuItem } from "./MenuItems";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  user: User | null;
  userType: string | null;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  menuItems, 
  user, 
  userType, 
  onLogout, 
  onClose 
}: MobileMenuProps) {
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