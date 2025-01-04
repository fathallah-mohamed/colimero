import { Package, Truck, Users, ClipboardList } from "lucide-react";

export const menuItems = [
  {
    name: "Envoyer un colis",
    href: "/envoyer-colis",
    icon: <Package className="w-4 h-4" />,
    highlight: true,
    className: " text-[#00B0F0] hover:text-[#0082b3]"
  },
  {
    name: "Tournées",
    href: "/tours",
    icon: <Truck className="w-4 h-4" />
  },
  {
    name: "Transporteurs",
    href: "/transporteurs",
    icon: <Users className="w-4 h-4" />
  },
  {
    name: "Demandes d'approbation",
    href: "/mes-demandes-approbation",
    icon: <ClipboardList className="w-4 h-4" />
  }
];

export default function MenuItems() {
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {menuItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            item.highlight
              ? "text-primary hover:text-primary-hover hover:bg-primary/10" +
                (item.className || "")
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </a>
      ))}
    </div>
  );
}