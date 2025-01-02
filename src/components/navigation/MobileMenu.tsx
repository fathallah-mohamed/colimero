import { Link } from "react-router-dom";
import { MenuItem } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  items: MenuItem[];
  user: User | null;
  userType: string | null;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({ isOpen, items, user, userType, onLogout, onClose }: MobileMenuProps) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col p-6 space-y-4 mt-16">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium",
                      "transition-all duration-300",
                      "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right",
                      "hover:text-primary hover:bg-primary/5",
                      isActive 
                        ? "text-primary bg-primary/5 after:bg-primary after:scale-x-100" 
                        : "text-gray-600 after:bg-primary after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <Link
                      to="/profil"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={onClose}
                    >
                      Profil
                    </Link>
                    {userType === 'carrier' ? (
                      <>
                        <Link
                          to="/mes-tournees"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                          onClick={onClose}
                        >
                          Mes tournées
                        </Link>
                        <Link
                          to="/demandes-approbation"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                          onClick={onClose}
                        >
                          Demandes d'approbation
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/mes-reservations"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                          onClick={onClose}
                        >
                          Mes réservations
                        </Link>
                        <Link
                          to="/demandes-approbation"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                          onClick={onClose}
                        >
                          Mes demandes d'approbation
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Button 
                    asChild 
                    variant="default" 
                    className="w-full justify-center bg-primary hover:bg-primary/90 text-white transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Link to="/connexion" onClick={onClose}>
                      Se connecter
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}