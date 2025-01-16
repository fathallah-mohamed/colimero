import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import MenuItems from "./MenuItems";
import { Button } from "../ui/button";
import { UserCircle2 } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  handleLogout,
  setIsOpen,
}: MobileMenuProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate('/connexion');
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-[80%] bg-white border-l shadow-lg h-[calc(100vh-65px)] top-[65px] overflow-y-auto",
        "transform transition-transform duration-300 ease-in-out lg:hidden",
        "translate-x-0"
      )}
    >
      {user ? (
        <div className="flex flex-col h-full">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <MenuItems />
            {userType === 'carrier' && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profil Transporteur
                </Link>
                <Link
                  to="/mes-tournees"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Mes tournées
                </Link>
                <Link
                  to="/demandes-approbation"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Demandes d'approbation
                </Link>
              </>
            )}
            {userType === 'client' && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profil Client
                </Link>
                <Link
                  to="/mes-reservations"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Mes réservations
                </Link>
              </>
            )}
            {userType === 'admin' && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profil Administrateur
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Tableau de bord
                </Link>
              </>
            )}
          </div>
          <div className="mt-auto border-t border-gray-200">
            <div className="px-4 py-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full text-white"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <MenuItems />
          </div>
          <div className="mt-auto px-4 py-3 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginClick}
              className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white"
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}