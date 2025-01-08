import { Calendar, Package, Info, Mail } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  className?: string;
}

export const menuItems: MenuItem[] = [
  { 
    name: "Planifier une tournée", 
    href: "/planifier-tournee", 
    icon: Calendar,
    highlight: true,
  },
  { 
    name: "Envoyer un colis", 
    href: "/envoyer-colis", 
    icon: Package,
    highlight: true,
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: Info,
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: Mail,
  },
];