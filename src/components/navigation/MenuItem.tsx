import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function MenuItem({ 
  name, 
  href, 
  icon: Icon, 
  highlight, 
  className, 
  onClick 
}: MenuItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2.5 rounded-md text-sm font-medium relative",
        "transition-all duration-300 ease-in-out hover:-translate-y-0.5",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5",
        "after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
        "hover:after:scale-x-100",
        highlight
          ? "text-white bg-gradient-primary hover:opacity-90 shadow-md hover:shadow-lg " + (className || "")
          : "text-gray-600 hover:text-gray-900"
      )}
    >
      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      <span className="ml-2">{name}</span>
    </Link>
  );
}