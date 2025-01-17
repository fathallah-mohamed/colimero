import { Calendar, Package, Info, Mail, Truck, List } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  hideTextOnMobile?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    name: "Envoyer un colis",
    href: "/envoyer-colis",
    icon: Package,
    highlight: true,
  },
  {
    name: "Planifier une tournée",
    href: "/planifier-tournee",
    icon: Calendar,
    highlight: true,
  },
  { 
    name: "Réservations", 
    href: "/client/reservations", 
    icon: List,
    hideTextOnMobile: true,
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