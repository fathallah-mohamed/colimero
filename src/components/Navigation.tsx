import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MenuItems } from "./navigation/MenuItems";
import { AccountMenu } from "./navigation/AccountMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigation } from "./navigation/useNavigation";

export default function Navigation() {
  const { isOpen, setIsOpen, user, userType, handleLogout, menuItems } = useNavigation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors">
            Colimero
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <MenuItems items={menuItems} className="text-base" />
            <AccountMenu 
              user={user} 
              userType={userType} 
              onLogout={handleLogout} 
            />
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