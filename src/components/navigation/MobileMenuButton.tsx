import { forwardRef } from "react";
import { motion } from "framer-motion";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const MobileMenuButton = forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  ({ isOpen, onClick, className }, ref) => {
    const Path = (props: any) => (
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
      />
    );

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200 ${className}`}
        aria-expanded={isOpen}
      >
        <span className="sr-only">
          {isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        </span>
        <svg width="24" height="24" viewBox="0 0 23 23">
          <Path
            variants={{
              closed: { d: "M 2 4 L 20 4" },
              open: { d: "M 3 19 L 17 5" }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <Path
            d="M 2 11.5 L 20 11.5"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.2 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 19 L 20 19" },
              open: { d: "M 3 5 L 17 19" }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
        </svg>
      </button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";