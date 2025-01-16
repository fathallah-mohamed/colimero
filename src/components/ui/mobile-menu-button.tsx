import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
}

export const MobileMenuButton = React.forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  ({ isOpen, className, ...props }, ref) => {
    const Path = (props: any) => (
      <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
      />
    );

    return (
      <button
        ref={ref}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 rounded-lg",
          "text-gray-600 hover:text-gray-900",
          "hover:bg-gray-100 focus:outline-none focus:ring-2",
          "focus:ring-primary focus:ring-offset-2 transition-colors duration-200",
          className
        )}
        aria-expanded={isOpen}
        {...props}
      >
        <span className="sr-only">
          {isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        </span>
        <svg
          width="32"
          height="32"
          viewBox="0 0 23 23"
          className="transform transition-transform duration-300"
        >
          <Path
            variants={{
              closed: { d: "M 2 4 L 20 4", opacity: 1 },
              open: { d: "M 3 19 L 17 5", opacity: 1 }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <Path
            d="M 2 11.5 L 20 11.5"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <Path
            variants={{
              closed: { d: "M 2 19 L 20 19", opacity: 1 },
              open: { d: "M 3 5 L 17 19", opacity: 1 }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </svg>
      </button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";