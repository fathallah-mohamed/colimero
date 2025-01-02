import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Package, Truck, Calendar, Users, MessageSquare, UserCircle2 } from "lucide-react";
import { useState } from "react";
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
  
  const icons = {
    "Planifier une tournée": <Calendar className="w-4 h-4" />,
    "Envoyer un colis": <Package className="w-4 h-4" />,
    "Transporteurs": <Truck className="w-4 h-4" />,
    "Actualités": <MessageSquare className="w-4 h-4" />,
    "Contact": <Users className="w-4 h-4" />,
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden fixed top-16 inset-x-0 bg-white shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => {
                onClose();
                if (item.onClick) item.onClick(e);
              }}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                item.highlight
                  ? "text-[#00B0F0] hover:text-[#0082b3] hover:bg-gray-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {icons[item.name as keyof typeof icons]}
              <span>{item.name}</span>
            </Link>
          ))}
          {!user && (
            <div className="mt-4 px-3">
              <Button 
                variant="outline" 
                className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white"
                onClick={() => {
                  onClose();
                  setShowAuthDialog(true);
                }}
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </div>
          )}
          {user && (
            <>
              <Link
                to="/profil"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={onClose}
              >
                <UserCircle2 className="w-4 h-4" />
                <span>Profil</span>
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