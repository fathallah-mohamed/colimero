import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { MenuItems } from "./navigation/MenuItems";
import MobileMenu from "./navigation/MobileMenu";
import { useSessionInitializer } from "./navigation/SessionInitializer";

export default function Navigation() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen, setIsOpen, user, userType, handleLogout } = useNavigation();

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      setIsMounted(false);
    };
  }, []);

  useSessionInitializer();

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`fixed top-0 w-full z-50 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <NavigationHeader 
              isScrolled={isScrolled}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              user={user}
              userType={userType}
              handleLogout={handleLogout}
              mobileButtonRef={null}
            />
            
            <div className="hidden md:flex items-center space-x-4">
              <MenuItems 
                isAuthenticated={!!user}
                userType={userType}
                currentPath={location.pathname}
              />

              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Déconnexion
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost">
                    <Link to="/connexion">Connexion</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/inscription">Inscription</Link>
                  </Button>
                </div>
              )}
            </div>

            <MobileMenu
              isOpen={isOpen}
              user={user}
              userType={userType}
              handleLogout={handleLogout}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}