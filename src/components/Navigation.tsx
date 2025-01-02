import { Link } from "react-router-dom";
import { Menu, X, Package, Truck, Calendar, Users, Info, MessageSquare } from "lucide-react";
import { MenuItems } from "./navigation/MenuItems";
import { AccountMenu } from "./navigation/AccountMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigation } from "./navigation/useNavigation";

export default function Navigation() {
  const { isOpen, setIsOpen, user, userType, handleLogout, menuItems } = useNavigation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#00B0F0] hover:text-[#0082b3] transition-colors">
              Colimero
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            <MenuItems 
              items={[
                { 
                  name: "Planifier une tournée", 
                  href: "/planifier-une-tournee", 
                  highlight: true,
                  icon: <Calendar className="w-4 h-4" />
                },
                { 
                  name: "Envoyer un colis", 
                  href: "/envoyer-un-colis", 
                  highlight: true,
                  icon: <Package className="w-4 h-4" />
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
              ]} 
              className="text-sm lg:text-base" 
            />
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <AccountMenu 
              user={user} 
              userType={userType} 
              onLogout={handleLogout} 
            />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00B0F0]"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        items={menuItems}
        user={user}
        userType={userType}
        onLogout={handleLogout}
        onClose={() => setIsOpen(false)}
      />
    </nav>
  );
}