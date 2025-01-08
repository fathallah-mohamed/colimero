import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigation } from "./useNavigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserCircle2, ClipboardList, Truck, Bell } from "lucide-react";

export default function MenuItems() {
  const location = useLocation();
  const { user, userType, handleLogout } = useNavigation();

  const getMenuItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { href: "/profil", icon: UserCircle2, label: "Profil" },
          { href: "/admin", icon: Bell, label: "Demandes d'inscription" }
        ];
      case 'carrier':
        return [
          { href: "/profil", icon: UserCircle2, label: "Profil" },
          { href: "/mes-tournees", icon: Truck, label: "Mes tournées" },
          { href: "/demandes-approbation", icon: Bell, label: "Demandes d'approbation" }
        ];
      default: // client
        return [
          { href: "/profil", icon: UserCircle2, label: "Profil" },
          { href: "/mes-reservations", icon: ClipboardList, label: "Mes réservations" }
        ];
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      {/* Menu items communs */}
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className="relative"
          >
            <motion.div
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-primary/10 hover:scale-105",
                "active:scale-95",
                isActive ? "text-primary" : "text-gray-700",
                item.highlight && !isActive && "bg-primary text-white hover:bg-primary/90",
                item.className
              )}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <item.icon 
                className={cn(
                  "w-4 h-4 mr-2",
                  isActive ? "text-primary" : item.highlight ? "text-white" : "text-gray-500"
                )}
              />
              <span>{item.name}</span>
              
              {isActive && !item.highlight && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}

      {/* Menu utilisateur connecté */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">{user.email}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {getMenuItems().map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link to={item.href} className="flex items-center gap-2 cursor-pointer">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}