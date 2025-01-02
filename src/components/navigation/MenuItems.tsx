import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  name: string;
  href: string;
  highlight?: boolean;
  icon?: LucideIcon;
  onClick?: (e: React.MouseEvent) => void;
}

interface MenuItemsProps {
  items: MenuItem[];
  className?: string;
  onItemClick?: () => void;
}

export function MenuItems({ items, className = "", onItemClick }: MenuItemsProps) {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={(e) => {
            if (onItemClick) onItemClick();
            if (item.onClick) item.onClick(e);
          }}
          className={`${className} flex items-center space-x-2`}
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
}