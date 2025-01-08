import { Calendar, Package, Home, Users, FileText } from "lucide-react";

export interface MenuItem {
  name: string;
  href: string;
  icon: any;
  allowedUserTypes: string[];
  requiresAuth: boolean;
  highlight?: boolean;
  className?: string;
}

export const menuItems: MenuItem[] = [
  {
    name: "Accueil",
    href: "/",
    icon: Home,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false,
    highlight: false
  },
  {
    name: "Planifier une tournée",
    href: "/planifier-tournee", 
    icon: Calendar,
    allowedUserTypes: ["carrier"],
    requiresAuth: true,
    highlight: false
  },
  {
    name: "Envoyer un colis",
    href: "/envoyer-colis", 
    icon: Package,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false,
    highlight: false
  },
  {
    name: "Transporteurs",
    href: "/transporteurs",
    icon: Users,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false,
    highlight: false
  },
  {
    name: "Blog",
    href: "/blog",
    icon: FileText,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false,
    highlight: false
  }
];