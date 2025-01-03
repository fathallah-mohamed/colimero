import { Link } from "react-router-dom";
import { Menu, X, Package, Truck, Calendar, Users, Info, MessageSquare, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { useNavigation } from "./navigation/useNavigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, userType, handleLogout } = useNavigation();

  const menuItems = [
    { 
      name: "Planifier une tournée", 
      href: "/planifier-une-tournee", 
      icon: <Calendar className="w-4 h-4" />,
      highlight: true
    },
    { 
      name: "Envoyer un colis", 
      href: "/envoyer-un-colis", 
      icon: <Package className="w-4 h-4" />,
      highlight: true
    },
    { 
      name: "Transporteurs", 
      href: "/nos-transporteurs",
      icon: <Truck className="w-4 h-4" />
    },
    { 
      name: "Actualités", 
      href: "/actualites",
      icon: <MessageSquare className="w-4 h-4" />
    },
    { 
      name: "À propos", 
      href: "/a-propos",
      icon: <Info className="w-4 h-4" />
    },
    { 
      name: "Contact", 
      href: "/nous-contacter",
      icon: <Users className="w-4 h-4" />
    }
  ];

  const userMenuItems = userType === 'carrier' ? [
    { name: "Profil", href: "/profil", icon: <UserCircle2 className="w-4 h-4" /> },
    { name: "Mes tournées", href: "/mes-tournees", icon: <Truck className="w-4 h-4" /> },
    { name: "Demandes d'approbation", href: "/demandes-approbation", icon: <Users className="w-4 h-4" /> }
  ] : [
    { name: "Profil", href: "/profil", icon: <UserCircle2 className="w-4 h-4" /> },
    { name: "Mes réservations", href: "/mes-reservations", icon: <Package className="w-4 h-4" /> }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#00B0F0] hover:text-[#0082b3] transition-colors">
            Colimero
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.highlight 
                    ? "text-[#00B0F0] hover:text-[#0082b3]" 
                    : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex md:items-center md:space-x-4">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAuthDialog(true)}
                  className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
                >
                  <UserCircle2 className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00B0F0]"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                item.highlight
                  ? "text-[#00B0F0] hover:text-[#0082b3]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}

          {user ? (
            <>
              <div className="border-t border-gray-200 pt-4 mt-4">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full mt-2 text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </Button>
              </div>
            </>
          ) : (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowAuthDialog(true);
                  setIsOpen(false);
                }}
                className="w-full border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
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
    </nav>
  );
}