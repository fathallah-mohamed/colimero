import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function MenuItem({ name, href, icon: Icon, highlight, className, onClick }: MenuItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
        ${highlight
          ? "text-[#00B0F0] hover:text-[#0082b3] " + (className || "")
          : "text-gray-700 hover:text-gray-900"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span className="ml-2">{name}</span>
    </Link>
  );
}