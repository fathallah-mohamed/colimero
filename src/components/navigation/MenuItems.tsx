import { Link } from "react-router-dom";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { useNavigation } from "./useNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const menuItems = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: <Calendar className="w-4 h-4" />, 
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["carrier"]
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: <Package className="w-4 h-4" />, 
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["client"]
  },
  { 
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: <Truck className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "Actualités", 
    href: "/blog", 
    icon: <MessageSquare className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: <Info className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: <Users className="w-4 h-4" />,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
];

export default function MenuItems() {
  const { userType } = useNavigation();
  const { toast } = useToast();

  const handleRestrictedClick = (itemName: string, allowedTypes: string[]) => {
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
    <div className="hidden md:flex md:items-center md:space-x-4">
      {menuItems.map((item) => {
        const isAllowed = !userType || item.allowedUserTypes.includes(userType);

        return isAllowed ? (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (!item.allowedUserTypes.includes(userType || '')) {
                e.preventDefault();
                handleRestrictedClick(item.name, item.allowedUserTypes);
              }
            }}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${item.highlight
                ? "text-[#00B0F0] hover:text-[#0082b3] " + (item.className || "")
                : "text-gray-700 hover:text-gray-900"
              }
              ${!item.allowedUserTypes.includes(userType || '') ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ) : null;
      })}
    </div>
  );
}