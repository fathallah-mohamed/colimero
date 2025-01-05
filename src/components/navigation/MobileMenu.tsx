import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { menuItems } from "./MenuItems";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  userMenuItems: any[];
  handleLogout: () => void;
  setIsOpen: (value: boolean) => void;
  setShowAuthDialog: (value: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  userMenuItems,
  handleLogout,
  setIsOpen,
  setShowAuthDialog
}: MobileMenuProps) {
  const { toast } = useToast();

  const handleRestrictedClick = (itemName: string, allowedTypes: string[]) => {
    if (!userType) {
      toast({
        title: "Accès restreint",
        description: "Vous devez être connecté pour accéder à cette fonctionnalité.",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(userType)) {
      const messages = {
        admin: "Les administrateurs n'ont pas accès à cette fonctionnalité.",
        carrier: "Les transporteurs ne peuvent pas envoyer de colis.",
        client: "Les clients ne peuvent pas créer de tournées."
      };
      
      toast({
        title: "Accès restreint",
        description: messages[userType as keyof typeof messages],
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-64 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Fermer le menu"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        <div className="px-2 pt-20 pb-3 space-y-1">
          {menuItems.map((item) => {
            const isAllowed = !userType || item.allowedUserTypes.includes(userType);

            return isAllowed ? (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => {
                  if (!item.allowedUserTypes.includes(userType || '')) {
                    e.preventDefault();
                    handleRestrictedClick(item.name, item.allowedUserTypes);
                  }
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                  item.highlight 
                    ? "text-primary hover:text-primary-hover hover:bg-primary/10" + (item.className || "")
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                  !item.allowedUserTypes.includes(userType || '') && "opacity-50 cursor-not-allowed"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ) : null;
          })}

          {user ? (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 py-2 text-sm text-gray-600">
                {user.email}
              </div>
              {userMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
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
                className="w-full mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-200"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowAuthDialog(true);
                  setIsOpen(false);
                }}
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}