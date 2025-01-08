import { Link } from "react-router-dom";
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
    <div className="flex items-center space-x-1">
      {menuItems.map((item) => {
        const isAllowed = !item.requiresAuth || (userType && item.allowedUserTypes.includes(userType));
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (item.requiresAuth && !isAllowed) {
                handleRestrictedClick(e, item.name, item.allowedUserTypes);
              }
            }}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${item.highlight
                ? "text-primary hover:text-primary-hover " + (item.className || "")
                : "text-gray-700 hover:text-gray-900"
              }
              ${!isAllowed && item.requiresAuth ? "opacity-50 cursor-not-allowed" : ""}
              transition-all duration-200 ease-in-out
            `}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}