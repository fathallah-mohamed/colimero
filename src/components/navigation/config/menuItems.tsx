import { Calendar, Package, Info, Mail, Truck } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  hideTextOnMobile?: boolean;
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
    name: "Transporteurs", 
    href: "/transporteurs", 
    icon: Truck,
    hideTextOnMobile: true,
  },
  { 
    name: "À propos", 
    href: "/a-propos", 
    icon: Info,
    hideTextOnMobile: true,
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: Mail,
    hideTextOnMobile: true,
  },
];