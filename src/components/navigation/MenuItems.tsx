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
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (onItemClick) onItemClick();
              if (item.onClick) item.onClick(e);
            }}
            className={`${className} flex items-center gap-2 transition-colors duration-200 hover:text-primary ${
              item.highlight
                ? "text-primary font-medium"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );
}