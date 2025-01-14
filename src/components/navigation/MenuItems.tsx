import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./config/menuItems";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItemsProps {
  isMobile?: boolean;
}

export default function MenuItems({ isMobile }: MenuItemsProps) {
  const location = useLocation();
  const isDefaultMobile = useIsMobile();
  const isMobileView = isMobile || isDefaultMobile;

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isActive = location.pathname === item.href;
    const content = (
      <motion.div
        className={cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-primary/10 hover:scale-105 active:scale-95",
          isActive ? "text-primary" : "text-gray-700",
          item.highlight && !isActive && "bg-primary text-white hover:bg-primary/90",
          isMobileView && "w-full"
        )}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <item.icon 
          className={cn(
            "w-5 h-5 shrink-0",
            isActive ? "text-primary" : item.highlight ? "text-white" : "text-gray-500",
            isMobileView ? "mr-3" : "mr-2"
          )}
        />
        <span className={cn(
          "whitespace-nowrap",
          isMobileView ? "block" : item.hideTextOnMobile ? "hidden xl:block" : "block"
        )}>
          {item.name}
        </span>
        
        {isActive && !item.highlight && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    );

    return isMobileView ? (
      <Link
        key={item.name}
        to={item.href}
        className="w-full"
      >
        {content}
      </Link>
    ) : (
      <TooltipProvider key={item.name}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              className="relative"
            >
              {content}
            </Link>
          </TooltipTrigger>
          {item.hideTextOnMobile && (
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn(
      isMobileView 
        ? "flex flex-col space-y-1 w-full" 
        : "flex items-center space-x-1 lg:flex-nowrap lg:overflow-x-auto lg:pb-2 scrollbar-hide"
    )}>
      {menuItems.map(renderMenuItem)}
    </div>
  );
}