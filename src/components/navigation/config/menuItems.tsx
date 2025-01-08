import { Calendar, Package, Truck, MessageSquare, Info, Users, UserCog } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  className?: string;
  allowedUserTypes: string[];
  requiresAuth?: boolean;
}

export const menuItems: MenuItem[] = [
  { 
    name: "Administrateurs", 
    href: "/admin", 
    icon: UserCog,
    allowedUserTypes: ["admin"],
    requiresAuth: true
  },
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: Calendar,
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["carrier"],
    requiresAuth: true
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: Package,
    highlight: true,
    className: "bg-blue-50",
    allowedUserTypes: ["client"],
    requiresAuth: false
  },
  { 
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: Truck,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "Actualités", 
    href: "/blog", 
    icon: MessageSquare,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: Info,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: Users,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
];