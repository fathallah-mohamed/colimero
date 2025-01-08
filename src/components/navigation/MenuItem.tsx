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
      className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium 
        group relative overflow-hidden
        ${highlight
          ? "text-primary hover:text-primary-hover " + (className || "")
          : "text-gray-600 hover:text-gray-900"
        }
        transition-all duration-300 ease-in-out hover:-translate-y-0.5
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
        after:bg-primary after:scale-x-0 after:origin-left
        hover:after:scale-x-100 after:transition-transform after:duration-300
      `}
    >
      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      <span className="ml-2">{name}</span>
    </Link>
  );
}