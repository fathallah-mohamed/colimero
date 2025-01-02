import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Package, Truck, Calendar, Users, Info, MessageSquare, UserCircle2 } from "lucide-react";
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
    "Planifier une tournée": <Calendar className="w-5 h-5" />,
    "Envoyer un colis": <Package className="w-5 h-5" />,
    "Transporteurs": <Truck className="w-5 h-5" />,
    "Actualités": <MessageSquare className="w-5 h-5" />,
    "À propos": <Info className="w-5 h-5" />,
    "Contact": <Users className="w-5 h-5" />,
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden fixed inset-0 bg-black bg-opacity-50 z-40`}
        onClick={onClose}
      />
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-200 ease-in-out overflow-y-auto`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <UserCircle2 className="w-8 h-8 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {userType === 'carrier' ? 'Transporteur' : 'Client'}
                    </div>
                  </div>
                </div>
              </div>

              {items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    onClose();
                    if (item.onClick) item.onClick;
                  }}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    item.highlight
                      ? "text-[#00B0F0] hover:text-[#0082b3] hover:bg-gray-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {icons[item.name as keyof typeof icons]}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}

              <div className="px-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-700 hover:text-gray-900"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                >
                  <UserCircle2 className="w-5 h-5 mr-3" />
                  Déconnexion
                </Button>
              </div>
            </>
          ) : (
            <div className="px-3 pt-2">
              <Button
                className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
                onClick={() => {
                  onClose();
                  setShowAuthDialog(true);
                }}
              >
                <UserCircle2 className="w-5 h-5 mr-2" />
                Se connecter
              </Button>
            </div>
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