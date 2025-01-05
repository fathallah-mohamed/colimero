import { Calendar, Package, Truck, MessageSquare, Info, Users, UserCog } from "lucide-react";

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

export const adminMenuItem = {
  name: "Administrateurs",
  href: "/admin",
  icon: UserCog,
  allowedUserTypes: ["admin"]
};