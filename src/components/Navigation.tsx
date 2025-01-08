import { Link } from "react-router-dom";
import { menuItems } from "@/components/navigation/config/menuItems";
import { useNavigation } from "@/components/navigation/useNavigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navigation() {
  const { user } = useNavigation();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link 
        to="/" 
        className="text-2xl lg:text-3xl font-bold text-primary hover:opacity-90 transition-opacity"
      >
        Colimero
      </Link>
      <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "group relative flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
              "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80",
              "lg:text-base"
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
                    "text-primary",
                    "mr-2"
                  )}
                />
              )}
              <span>{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
}