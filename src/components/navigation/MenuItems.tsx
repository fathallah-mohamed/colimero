import { Link, useLocation } from "react-router-dom";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { useNavigation } from "./useNavigation";
import { useToast } from "@/hooks/use-toast";

export const menuItems = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: <Calendar className="w-4 h-4" />, 
    highlight: true,
    className: "bg-gradient-primary text-white hover:text-white shadow-md hover:shadow-lg hover:opacity-90",
    allowedUserTypes: ["carrier"],
    requiresAuth: true
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: <Package className="w-4 h-4" />, 
    highlight: true,
    className: "bg-gradient-primary text-white hover:text-white shadow-md hover:shadow-lg hover:opacity-90",
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
  const location = useLocation();

  const handleRestrictedClick = (e: React.MouseEvent, itemName: string, allowedTypes: string[]) => {
    e.preventDefault();
    if (!userType) {
      toast({
        title: "Accès restreint",
        description: "Vous devez être connecté pour accéder à cette fonctionnalité.",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(userType)) {
      const messages = {
        admin: "Les administrateurs n'ont pas accès à cette fonctionnalité.",
        carrier: "Les transporteurs ne peuvent pas envoyer de colis.",
        client: "Les clients ne peuvent pas créer de tournées."
      };
      
      toast({
        title: "Accès restreint",
        description: messages[userType as keyof typeof messages],
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {menuItems.map((item) => {
        const isAllowed = !item.requiresAuth || (userType && item.allowedUserTypes.includes(userType));
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (item.requiresAuth && !isAllowed) {
                handleRestrictedClick(e, item.name, item.allowedUserTypes);
              }
            }}
            className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium 
              group relative overflow-hidden
              ${item.highlight
                ? item.className
                : `text-gray-600 hover:text-gray-900 ${isActive ? "bg-gray-100" : ""}`
              }
              ${!isAllowed && item.requiresAuth ? "opacity-50 cursor-not-allowed" : ""}
              transition-all duration-300 ease-in-out hover:-translate-y-0.5
              ${!item.highlight ? `
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
                after:bg-primary after:scale-x-0 after:origin-left
                hover:after:scale-x-100 after:transition-transform after:duration-300
              ` : ""}
            `}
          >
            <span className={`transition-transform duration-300 group-hover:scale-110 ${item.highlight ? "text-white" : ""}`}>
              {item.icon}
            </span>
            <span className={`ml-2 ${item.highlight ? "text-white" : ""}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}