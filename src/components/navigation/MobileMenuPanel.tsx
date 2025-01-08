import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { forwardRef } from "react";

interface MobileMenuPanelProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setShowAuthDialog: (show: boolean) => void;
}

export const MobileMenuPanel = forwardRef<HTMLDivElement, MobileMenuPanelProps>(
  ({ isOpen, user, userType, handleLogout, setIsOpen, setShowAuthDialog }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm transform transition-transform duration-300 ease-in-out md:hidden z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <MobileMenu
          isOpen={isOpen}
          user={user}
          userType={userType}
          handleLogout={handleLogout}
          setIsOpen={setIsOpen}
          setShowAuthDialog={setShowAuthDialog}
        />
      </div>
    );
  }
);

MobileMenuPanel.displayName = "MobileMenuPanel";