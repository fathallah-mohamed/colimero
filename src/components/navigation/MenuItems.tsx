import { Link } from "react-router-dom";
import { Package, Truck, Info, MessageSquare, Calendar } from "lucide-react";

export const menuItems = [
  { name: "Envoyer un colis", href: "/envoyer-colis", icon: <Package className="w-4 h-4" />, highlight: true },
  { name: "Planifier une tournée", href: "/planifier-tournee", icon: <Calendar className="w-4 h-4" /> },
  { name: "Transporteurs", href: "/transporteurs", icon: <Truck className="w-4 h-4" /> },
  { name: "À propos", href: "/a-propos", icon: <Info className="w-4 h-4" /> },
  { name: "Contact", href: "/contact", icon: <MessageSquare className="w-4 h-4" /> },
];

export default function MenuItems() {
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            item.highlight
              ? "text-[#00B0F0] hover:text-[#0082b3]"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}