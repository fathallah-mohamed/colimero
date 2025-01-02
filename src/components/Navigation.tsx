import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Package, Users, UserCircle2 } from "lucide-react";
import { AccountMenu } from "./navigation/AccountMenu";
import { MenuItems } from "./navigation/MenuItems";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigation } from "./navigation/useNavigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, showAuthDialog, setShowAuthDialog } = useNavigation();

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
                  name: "Envoyer un colis",
                  to: "/envoyer-un-colis",
                  highlight: true,
                  icon: <Package className="w-4 h-4" />
                },
                { 
                  name: "Nos transporteurs",
                  to: "/nos-transporteurs",
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
              showAuthDialog={showAuthDialog}
              setShowAuthDialog={setShowAuthDialog}
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

        <MobileMenu isOpen={isOpen} />
      </div>
    </nav>
  );
}