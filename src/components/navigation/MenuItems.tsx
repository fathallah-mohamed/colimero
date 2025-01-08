import { Link } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { useNavigation } from "./useNavigation";
import { cn } from "@/lib/utils";

export default function MenuItems() {
  const { user } = useNavigation();

  return (
    <div className="flex items-center space-x-1">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "group relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
            item.highlight
              ? "text-white bg-primary hover:bg-primary-hover shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
            "sm:text-xs md:text-sm lg:text-base", // Responsive text sizes
            item.className
          )}
        >
          {item.icon && (
            <item.icon 
              className={cn(
                "w-4 h-4 transition-transform duration-200 ease-in-out",
                "sm:mr-0 md:mr-2", // Hide text on small screens
                "group-hover:scale-110"
              )} 
            />
          )}
          <span className="hidden md:inline ml-2">{item.name}</span>
          {/* Tooltip for small screens */}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden">
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}