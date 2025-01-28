import { Link } from "react-router-dom";
import { Calendar, Package, Truck, Info, Mail, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function MenuItems() {
  const menuItems = [
    {
      name: "Planifier une tournée",
      href: "/planifier-tournee",
      icon: Calendar,
      highlight: true
    },
    {
      name: "Envoyer un colis",
      href: "/envoyer-colis",
      icon: Package,
      highlight: true
    },
    {
      name: "Transporteurs",
      href: "/transporteurs",
      icon: Truck
    },
    {
      name: "À propos",
      href: "/a-propos",
      icon: Info
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Mail
    }
  ];

  return (
    <div className="flex flex-col space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="w-full"
        >
          <motion.div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-primary/10",
              item.highlight && "bg-primary/20 text-primary"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className={cn(
              "w-5 h-5 mr-3",
              item.highlight ? "text-primary" : "text-gray-500"
            )} />
            <span>{item.name}</span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}