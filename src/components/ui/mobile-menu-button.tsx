import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
}

export const MobileMenuButton = React.forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  ({ isOpen, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("block lg:hidden", className)} // Changed to always show on mobile/tablet
        {...props}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
        <span className="sr-only">Menu</span>
      </Button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";