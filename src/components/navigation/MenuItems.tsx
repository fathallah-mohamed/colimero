import { Link } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { useNavigation } from "./useNavigation";

export default function MenuItems() {
  const { user } = useNavigation();

  return (
    <div className="flex items-center space-x-1">
      {menuItems.map((item) => {
        // Si l'élément nécessite une authentification et que l'utilisateur n'est pas connecté,
        // on redirige vers la page de connexion
        const href = item.requiresAuth && !user ? "/connexion" : item.href;

        return (
          <Link
            key={item.name}
            to={href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${item.highlight
                ? "text-primary hover:text-primary-hover " + (item.className || "")
                : "text-gray-700 hover:text-gray-900"
              }
              transition-all duration-200 ease-in-out
            `}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            <span className="ml-2">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}