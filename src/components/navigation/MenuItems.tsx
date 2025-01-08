import { Link } from "react-router-dom";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { useNavigation } from "./useNavigation";

export const menuItems = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: <Calendar className="w-4 h-4" />, 
    highlight: true,
    className: "bg-primary/10"
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: <Package className="w-4 h-4" />, 
    highlight: true,
    className: "bg-primary/10"
  },
  { 
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: <Truck className="w-4 h-4" />
  },
  { 
    name: "Actualités", 
    href: "/blog", 
    icon: <MessageSquare className="w-4 h-4" />
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: <Info className="w-4 h-4" />
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: <Users className="w-4 h-4" />
  },
];

export default function MenuItems() {
  const { userType } = useNavigation();

  return (
    <div className="flex items-center space-x-1">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
            ${item.highlight
              ? "text-primary hover:text-primary-hover " + (item.className || "")
              : "text-gray-700 hover:text-gray-900"
            }
            transition-all duration-200 ease-in-out
          `}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}