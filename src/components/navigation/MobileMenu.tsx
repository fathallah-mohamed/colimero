import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  items: MenuItem[];
  user: User | null;
  userType: string | null;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({ isOpen, items, user, userType, onLogout, onClose }: MobileMenuProps) {
  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-lg z-50`}
    >
      <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => {
                onClose();
                if (item.onClick) item.onClick(e);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                item.highlight
                  ? "text-primary hover:bg-gray-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
            >
              {Icon && <Icon className="h-5 w-5" />}
              {item.name}
            </Link>
          );
        })}
        {user ? (
          <>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/profil"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={onClose}
                >
                  Profil
                </Link>
                {userType === 'carrier' ? (
                  <>
                    <Link
                      to="/mes-tournees"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Mes tournées
                    </Link>
                    <Link
                      to="/demandes-approbation"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Demandes d'approbation
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/mes-reservations"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Mes réservations
                    </Link>
                    <Link
                      to="/demandes-approbation"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
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
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 px-3">
            <Button asChild variant="outline" className="w-full justify-center">
              <Link to="/connexion">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}