import { Link } from "react-router-dom";
import { Menu, X, Package2, Truck, Calendar, Search } from "lucide-react";
import { MenuItems } from "./navigation/MenuItems";
import { AccountMenu } from "./navigation/AccountMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigation } from "./navigation/useNavigation";
import { Button } from "./ui/button";

export default function Navigation() {
  const { isOpen, setIsOpen, user, userType, handleLogout, menuItems } = useNavigation();

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#00B0F0] hover:text-[#0082b3] transition-colors">
            Colimero
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <MenuItems items={menuItems} className="flex items-center space-x-2 text-gray-700 hover:text-[#00B0F0] transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#00B0F0] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" />
            
            {!user ? (
              <Button 
                asChild
                variant="outline" 
                className="border border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-300 rounded-lg px-6"
              >
                <Link to="/connexion">Se connecter</Link>
              </Button>
            ) : (
              <AccountMenu 
                user={user} 
                userType={userType} 
                onLogout={handleLogout} 
              />
            )}
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