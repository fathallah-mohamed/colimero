import { Menu, X } from "lucide-react";
import { forwardRef } from "react";
import { motion } from "framer-motion";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  ({ isOpen, onClick }, ref) => {
    const Path = (props: any) => (
      <motion.path
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
      />
    );

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="sr-only">
          {isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        </span>
        <svg width="23" height="23" viewBox="0 0 23 23">
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
            animate={isOpen ? "open" : "closed"}
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.1 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" }
            }}
            animate={isOpen ? "open" : "closed"}
          />
        </svg>
      </button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";