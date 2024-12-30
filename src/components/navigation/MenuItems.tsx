import { Link } from "react-router-dom";

export interface MenuItem {
  name: string;
  href: string;
  highlight?: boolean;
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
          className={`${className} ${
            item.highlight
              ? "text-[#00B0F0] font-medium"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
}