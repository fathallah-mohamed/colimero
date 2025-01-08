import { Link } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { useNavigation } from "./useNavigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function MenuItems() {
  const { user } = useNavigation();

  return (
    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "group relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out",
            item.highlight
              ? "text-white bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80",
            "lg:text-base", // Larger text on larger screens
            item.className
          )}
        >
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {item.icon && (
              <item.icon 
                className={cn(
                  "w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-200",
                  !item.highlight && "text-primary",
                  "mr-2"
                )}
              />
            )}
            <span>{item.name}</span>
          </motion.div>
          
          {/* Highlight effect for primary actions */}
          {item.highlight && (
            <motion.div
              className="absolute inset-0 bg-white rounded-md opacity-0 group-hover:opacity-10 transition-opacity duration-200"
              layoutId={`highlight-${item.name}`}
            />
          )}
        </Link>
      ))}
    </div>
  );
}