import { Link, useNavigate } from "react-router-dom";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { useNavigation } from "./useNavigation";
import { useToast } from "@/hooks/use-toast";

export const menuItems = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: <Calendar className="w-4 h-4" />, 
    highlight: true,
    className: "bg-primary/10",
    allowedUserTypes: ["carrier"],
    requiresAuth: true
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: <Package className="w-4 h-4" />, 
    highlight: true,
    className: "bg-primary/10",
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: <Truck className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "Actualités", 
    href: "/blog", 
    icon: <MessageSquare className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: <Info className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: <Users className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
];

export default function MenuItems() {
  const { userType } = useNavigation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent, item: typeof menuItems[0]) => {
    if (item.name === "Planifier une tournée") {
      e.preventDefault();
      
      if (!userType) {
        toast({
          title: "Accès restreint",
          description: "Vous devez être connecté pour accéder à cette fonctionnalité.",
          variant: "destructive",
        });
        return;
      }

      if (userType === "carrier") {
        navigate("/planifier-tournee");
      } else {
        toast({
          title: "Accès restreint",
          description: "Seuls les transporteurs peuvent créer des tournées.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={(e) => handleClick(e, item)}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
            ${item.highlight
              ? "text-primary hover:text-primary-hover " + (item.className || "")
              : "text-gray-700 hover:text-gray-900"
            }
            ${item.name === "Planifier une tournée" && userType !== "carrier" ? "opacity-50" : ""}
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