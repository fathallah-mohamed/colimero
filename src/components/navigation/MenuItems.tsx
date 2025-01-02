import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const location = useLocation();

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              if (onItemClick) onItemClick();
              if (item.onClick) item.onClick(e);
            }}
            className={cn(
              "group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
              "relative hover:text-primary",
              isActive ? "text-primary bg-primary/5" : "text-gray-600",
              className
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="relative">
              {item.name}
              <span 
                className={cn(
                  "absolute -bottom-0.5 left-0 h-0.5 bg-primary transition-all duration-300",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </span>
          </Link>
        );
      })}
    </>
  );
}