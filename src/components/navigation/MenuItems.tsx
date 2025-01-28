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

export default function MenuItems() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isActive = location.pathname === item.href;
    const content = (
      <motion.div
        className={cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-primary/10 hover:scale-105 active:scale-95",
          isActive ? "text-primary" : "text-gray-700",
          item.highlight && !isActive && "bg-primary text-white hover:bg-primary/90",
          "w-full lg:w-auto justify-start lg:justify-center"
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <item.icon 
          className={cn(
            "w-5 h-5 shrink-0",
            isActive ? "text-primary" : item.highlight ? "text-white" : "text-gray-500",
            isMobile ? "mr-3" : "mr-2"
          )}
        />
        <span className={cn(
          "whitespace-nowrap",
          isMobile ? "block" : item.hideTextOnMobile ? "hidden xl:block" : "block"
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

    return isMobile ? (
      <Link
        key={item.name}
        to={item.href}
        className="w-full block"
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
      "flex",
      isMobile ? "flex-col space-y-1" : "items-center space-x-1 lg:flex-nowrap lg:overflow-x-auto lg:pb-2",
      "scrollbar-hide"
    )}>
      {menuItems.map(renderMenuItem)}
    </div>
  );
}