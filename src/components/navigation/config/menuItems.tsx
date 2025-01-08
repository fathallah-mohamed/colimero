import { Calendar, Package, Home, Users, FileText } from "lucide-react";

export const menuItems = [
  {
    name: "Accueil",
    href: "/",
    icon: Home,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  {
    name: "Planifier une tournée",
    href: "/planifier-tournee", 
    icon: Calendar,
    allowedUserTypes: ["carrier"],
    requiresAuth: true
  },
  {
    name: "Envoyer un colis",
    href: "/envoyer-colis", 
    icon: Package,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  {
    name: "Transporteurs",
    href: "/transporteurs",
    icon: Users,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  },
  {
    name: "Blog",
    href: "/blog",
    icon: FileText,
    allowedUserTypes: ["client", "carrier", "admin"],
    requiresAuth: false
  }
];