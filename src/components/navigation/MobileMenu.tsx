import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Package, Truck, Calendar, Users, MessageSquare, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthDialog from "../auth/AuthDialog";

interface MobileMenuProps {
  isOpen: boolean;
  items: MenuItem[];
  user: User | null;
  userType: string | null;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({ isOpen, items, user, userType, onLogout, onClose }: MobileMenuProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const icons: { [key: string]: JSX.Element } = {
    "Planifier une tournée": <Calendar className="w-4 h-4" />,
    "Envoyer un colis": <Package className="w-4 h-4" />,
    "Transporteurs": <Truck className="w-4 h-4" />,
    "Actualités": <MessageSquare className="w-4 h-4" />,
    "Contact": <Users className="w-4 h-4" />,
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="py-6">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              {icons[item.name] && (
                <span className="mr-2">{icons[item.name]}</span>
              )}
              <span>{item.name}</span>
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profil"
                className="flex items-center px-3 py-2 mt-4 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
                Mon profil
              </Link>
              {userType === 'carrier' ? (
                <>
                  <Link
                    to="/mes-tournees"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    Mes tournées
                  </Link>
                  <Link
                    to="/demandes-approbation"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    Demandes d'approbation
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/mes-reservations"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    Mes réservations
                  </Link>
                  <Link
                    to="/demandes-approbation"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    Mes demandes d'approbation
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
              onClick={() => {
                onClose();
                setShowAuthDialog(true);
              }}
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          )}
        </div>
      </div>
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </>
  );
}