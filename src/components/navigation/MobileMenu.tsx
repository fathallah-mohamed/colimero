import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems } from "./config/menuItems";
import { UserMenuItems } from "./UserMenuItems";
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
        damping: 30,
        staggerChildren: 0.1
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
      x: 0,
      opacity: 1
    },
    closed: {
      x: 50,
      opacity: 0
    }
  };

  return (
    <motion.div 
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-200 shadow-lg transform xl:hidden", // Changed from lg:hidden to xl:hidden
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

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
        {/* Actions principales en haut */}
        <div className="space-y-2 mb-4">
          {menuItems
            .filter(item => item.highlight)
            .map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                className="w-full"
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </motion.div>
            ))}
        </div>

        {/* Menu items secondaires */}
        <div className="space-y-1 border-t border-gray-200 pt-4">
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
                  className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </motion.div>
            ))}
        </div>

        {/* Section utilisateur */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-600">
                {user.email}
              </div>
              <UserMenuItems userType={userType} />
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
            </>
          ) : (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}