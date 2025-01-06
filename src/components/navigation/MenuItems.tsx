import { Link } from "react-router-dom";
import { Calendar, Package, Truck, MessageSquare, Info, Users } from "lucide-react";
import { useNavigation } from "./useNavigation";
import { useToast } from "@/hooks/use-toast";

export const menuItems = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: Calendar, 
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["carrier"]
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: Package, 
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["client"]
  },
  { 
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: Truck,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "Actualités", 
    href: "/blog", 
    icon: MessageSquare,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: Info,
    allowedUserTypes: ["client", "carrier", "admin"]
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: Users,
    allowedUserTypes: ["client", "carrier", "admin"]
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
    <div className="hidden md:flex md:items-center md:space-x-4">
      {menuItems.map((item) => {
        const isAllowed = !userType || item.allowedUserTypes.includes(userType);
        const shouldPreventDefault = !item.allowedUserTypes.includes(userType || '');
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (shouldPreventDefault) {
                handleRestrictedClick(e, item.name, item.allowedUserTypes);
              }
            }}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${item.highlight
                ? "text-[#00B0F0] hover:text-[#0082b3] " + (item.className || "")
                : "text-gray-700 hover:text-gray-900"
              }
              ${shouldPreventDefault ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-2">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}