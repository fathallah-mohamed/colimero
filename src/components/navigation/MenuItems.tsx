import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function MenuItems() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center space-x-1">
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
                "w-[180px] justify-center",
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
                  "w-4 h-4 mr-2 shrink-0",
                  isActive ? "text-primary" : item.highlight ? "text-white" : "text-gray-500"
                )}
              />
              <span>{item.name}</span>
              
              {/* Animated underline for active state */}
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
    </div>
  );
}