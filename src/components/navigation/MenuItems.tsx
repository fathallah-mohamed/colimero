import { Link } from "react-router-dom";
import { menuItems } from "./config/menuItems";

export default function MenuItems() {
  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors",
            item.className,
            item.highlight && "text-primary hover:text-primary hover:bg-primary/10"
          )}
        >
          <item.icon className="w-5 h-5" />
          {!item.hideTextOnMobile && <span>{item.name}</span>}
        </Link>
      ))}
    </>
  );
}

import { cn } from "@/lib/utils";