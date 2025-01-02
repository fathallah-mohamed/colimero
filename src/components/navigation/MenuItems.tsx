import { Link } from "react-router-dom";
import { ReactNode } from "react";

export interface MenuItem {
  name: string;
  href: string;
  highlight?: boolean;
  icon?: ReactNode;
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
          className={`${className} group flex items-center whitespace-nowrap px-2 lg:px-3 py-2 rounded-md transition-all duration-200 ${
            item.highlight
              ? "text-[#00B0F0] hover:text-[#0082b3] font-medium"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {item.icon && <span className="mr-1.5">{item.icon}</span>}
          <span>{item.name}</span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B0F0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
        </Link>
      ))}
    </>
  );
}