import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems } from "./config/menuItems";
import { motion } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (value: boolean) => void;
  setShowAuthDialog: (value: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  handleLogout,
  setIsOpen,
  setShowAuthDialog
}: MobileMenuProps) {
  const menuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  return (
    <motion.div 
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className={cn(
        "fixed inset-y-0 right-0 w-64 bg-white border-l border-gray-200 shadow-lg transform md:hidden",
        "flex flex-col"
      )}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Fermer le menu</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {/* Actions principales en haut */}
        <div className="space-y-2 mb-4 border-b border-gray-200 pb-4">
          {menuItems
            .filter(item => item.highlight)
            .map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-colors duration-200"
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  {item.name}
                </Link>
              </motion.div>
            ))}
        </div>

        {/* Menu items secondaires */}
        {menuItems
          .filter(item => !item.highlight)
          .map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
            >
              <Link
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                {item.name}
              </Link>
            </motion.div>
          ))}

        {user ? (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="px-3 py-2 text-sm text-gray-600">
              {user.email}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full mt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
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
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}