import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { MenuItems } from "./navigation/MenuItems";
import { AccountMenu } from "./navigation/AccountMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigation } from "./navigation/useNavigation";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const { isOpen, setIsOpen, user, userType, handleLogout, menuItems } = useNavigation();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className={cn(
              "flex items-center text-2xl font-bold",
              "text-gray-900 hover:text-primary",
              "transition-colors duration-300"
            )}
          >
            Colimero
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden inline-flex items-center justify-center p-2 rounded-lg",
              "text-gray-500 hover:text-primary hover:bg-gray-50",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-all duration-300"
            )}
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
            <div className="flex items-center space-x-1">
              <MenuItems items={menuItems} className="text-base" />
            </div>
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