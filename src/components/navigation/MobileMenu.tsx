import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Package, Truck, Calendar, Users, Info, MessageSquare, UserCircle2, X } from "lucide-react";
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

  return (
    <>
      {/* Overlay */}
      <div
        className={`${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-40`}
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-2xl font-bold text-[#00B0F0]" onClick={onClose}>
            Colimero
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Main Menu Content */}
        <div className="p-4 space-y-6">
          {/* Primary Actions */}
          <div className="space-y-2">
            <Link
              to="/planifier-une-tournee"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg bg-[#00B0F0]/10 text-[#00B0F0] hover:bg-[#00B0F0]/20 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Planifier une tournée</span>
            </Link>
            <Link
              to="/envoyer-un-colis"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg bg-[#00B0F0]/10 text-[#00B0F0] hover:bg-[#00B0F0]/20 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Envoyer un colis</span>
            </Link>
          </div>

          {/* Secondary Links */}
          <div className="space-y-1">
            <Link
              to="/nos-transporteurs"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Truck className="w-5 h-5" />
              <span>Transporteurs</span>
            </Link>
            <Link
              to="/actualites"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Actualités</span>
            </Link>
            <Link
              to="/a-propos"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>À propos</span>
            </Link>
            <Link
              to="/nous-contacter"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Contact</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="pt-4 border-t">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-3">
                  <UserCircle2 className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {userType === 'carrier' ? 'Transporteur' : 'Client'}
                    </div>
                  </div>
                </div>
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
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </>
  );
}